// Rig Test Detail JavaScript
// Handles parent Rig Test editing and child Rig Test Data (Add Rig) CRUD.

$(document).ready(function () {
    $('.select2').select2();
    loadRigData();

    $('#editRigDetailsModal').on('show.bs.modal', function () {
        const modal = $(this);
        modal.find('input[name="type_of_testing"]').val($('#type_of_testing').text().trim());
        modal.find('input[name="hw_sw"]').val($('#hw_sw').text().trim());
        modal.find('input[name="version"]').val($('#version').text().trim());
        modal.find('input[name="rig_date"]').val($('#rig_date').text().trim());
        modal.find('input[name="pil_no"]').val($('#pil_no').text().trim());
        modal.find('input[name="observation"]').val($('#observation').text().trim());
        modal.find('input[name="data_file_no"]').val($('#data_file_no').text().trim());
        modal.find('textarea[name="rig_test_description"]').val($('#description').text().trim());
    });
});

function clearinput(inputId) {
    const el = document.getElementById(inputId);
    if (el) el.value = '';
}

function csrf() {
    return $('meta[name="csrf-token"]').attr('content') || window.csrfToken || '';
}

function escapeHtml(value) {
    return $('<div>').text(value == null ? '' : value).html();
}

// ---------------- Parent Rig Test ----------------
function saveRigDetails() {
    const form = $('#editRigDetailsForm')[0];
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const rigTestId = $('#pageElement').data('main-id');
    const formData = new FormData(form);

    $.ajax({
        url: '/rig_test/update-rig-test/' + rigTestId + '/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'X-CSRFToken': csrf() },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status === 200) {
                successAlert(response.message || 'Rig test details updated successfully.');
                $('#editRigDetailsModal').modal('hide');
                setTimeout(function () { location.reload(); }, 500);
            } else {
                warningAlert(response.message || 'Could not update rig test details.');
            }
        },
        error: function (xhr) {
            hideLoader();
            warningAlert(xhr.responseJSON?.message || 'Error updating rig test details.');
        }
    });
}

// ---------------- Child Rig Data ----------------
function checkselect1() {
    addRigRow();
}

function addRigRow(data = {}) {
    const tbody = $('#addrowtbody');
    const rowId = 'new_rig_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    const row = `
        <tr id="${rowId}" class="add-rig-row">
            <td class="text-center">New</td>
            <td><input type="text" class="form-control form-control-sm rig-data-input" data-field="type_of_rig_test" value="${escapeHtml(data.type_of_rig_test || '')}" placeholder="Enter type of rig test" required></td>
            <td><input type="text" class="form-control form-control-sm rig-data-input" data-field="software_version" value="${escapeHtml(data.software_version || '')}" placeholder="Enter software version" required></td>
            <td><input type="text" class="form-control form-control-sm rig-data-input" data-field="pil_no" value="${escapeHtml(data.pil_no || '')}" placeholder="Enter PIL No" required></td>
            <td><input type="text" class="form-control form-control-sm rig-data-input" data-field="file_no" value="${escapeHtml(data.file_no || '')}" placeholder="Enter File No" required></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-light text-danger remove-new-rig" title="Remove row"><i class="ri-delete-bin-line"></i></button>
            </td>
        </tr>`;

    tbody.append(row);
    $('#btnSaveAll').prop('disabled', false).show();
    $('#cancelbtn').show();
    $('#noDataOpenDiv').hide();
    tbody.find('tr:last .rig-data-input').first().focus();
}

function collectNewRigRow(row) {
    const result = {};
    let valid = true;
    $(row).find('.rig-data-input').each(function () {
        const field = $(this).data('field');
        const value = $(this).val().trim();
        if (!value) {
            valid = false;
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
        result[field] = value;
    });
    return valid ? result : null;
}

function saveNewRigData() {
    const rows = $('#addrowtbody .add-rig-row');
    if (!rows.length) return;

    const rigId = $('#pageElement').data('main-id');
    const payloads = [];
    let allValid = true;

    rows.each(function () {
        const data = collectNewRigRow(this);
        if (!data) allValid = false;
        else payloads.push(data);
    });

    if (!allValid) {
        warningAlert('Please fill all Rig Test fields before saving.');
        return;
    }

    $('#btnSaveAll').prop('disabled', true);
    showLoader();

    // One request/document per Add Rig row, all linked to this parent rig_id.
    Promise.all(payloads.map(function (data) {
        return $.ajax({
            url: '/rig_test/create-rig-data/',
            type: 'POST',
            data: JSON.stringify({ rig_id: rigId, ...data }),
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrf() }
        });
    })).then(function (responses) {
        hideLoader();
        const failed = responses.find(r => r.status !== 200);
        if (failed) {
            warningAlert(failed.message || 'Some Rig Data rows could not be saved.');
            $('#btnSaveAll').prop('disabled', false);
            return;
        }
        successAlert('Rig Data saved successfully.');
        $('#addrowtbody').empty();
        $('#btnSaveAll').hide().prop('disabled', true);
        $('#cancelbtn').hide();
        loadRigData();
    }).catch(function (xhr) {
        hideLoader();
        $('#btnSaveAll').prop('disabled', false);
        warningAlert(xhr.responseJSON?.message || 'Could not save Rig Data.');
    });
}

function loadRigData() {
    const rigId = $('#pageElement').data('main-id');
    if (!rigId) return;

    $.ajax({
        url: '/rig_test/get-rig-data/' + rigId + '/',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const tbody = $('#viewbooktbody');
            tbody.empty();
            if (!response || !Array.isArray(response.data) || response.data.length === 0) {
                $('#noDataOpenDiv').html('<div class="text-center text-muted py-3">No Rig Data added yet.</div>').show();
                return;
            }

            $('#noDataOpenDiv').hide();
            response.data.forEach(function (doc, index) {
                tbody.append(`
                    <tr data-id="${escapeHtml(doc._id)}">
                        <td class="text-center">${index + 1}</td>
                        <td>${escapeHtml(doc.type_of_rig_test)}</td>
                        <td>${escapeHtml(doc.software_version)}</td>
                        <td>${escapeHtml(doc.pil_no)}</td>
                        <td>${escapeHtml(doc.file_no)}</td>
                        <td class="text-center">
                            <a href="javascript:void(0)" class="me-2 edit-rig-data" data-id="${escapeHtml(doc._id)}" title="Edit"><i class="ri-edit-2-fill fs-16 text-primary"></i></a>
                            <a href="javascript:void(0)" class="text-danger delete-rig-data" data-id="${escapeHtml(doc._id)}" title="Delete"><i class="ri-delete-bin-5-fill fs-16"></i></a>
                        </td>
                    </tr>`);
            });
        },
        error: function (xhr) {
            console.error('Failed to load Rig Data:', xhr.responseText);
            warningAlert(xhr.responseJSON?.message || 'Could not load Rig Data.');
        }
    });
}

function openEditRigData(id) {
    $.ajax({
        url: '/rig_test/get-rig-data/' + $('#pageElement').data('main-id') + '/',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const doc = (response.data || []).find(item => item._id === id);
            if (!doc) {
                warningAlert('Rig Data record not found.');
                return;
            }
            $('#edit_rig_data_id').val(doc._id);
            $('#edit_type_of_rig_test').val(doc.type_of_rig_test || '');
            $('#edit_software_version').val(doc.software_version || '');
            $('#edit_pil_no').val(doc.pil_no || '');
            $('#edit_file_no').val(doc.file_no || '');
            $('#editRigDataModal').modal('show');
        },
        error: function () { warningAlert('Could not load Rig Data.'); }
    });
}

function updateRigData() {
    const id = $('#edit_rig_data_id').val();
    const form = $('#editRigDataForm')[0];
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    $.ajax({
        url: '/rig_test/update-rig-data/' + id + '/',
        type: 'POST',
        data: $(form).serialize(),
        headers: { 'X-CSRFToken': csrf() },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status === 200) {
                successAlert(response.message || 'Rig Data updated successfully.');
                $('#editRigDataModal').modal('hide');
                loadRigData();
            } else {
                warningAlert(response.message || 'Could not update Rig Data.');
            }
        },
        error: function (xhr) {
            hideLoader();
            warningAlert(xhr.responseJSON?.message || 'Could not update Rig Data.');
        }
    });
}

$(document).on('click', '.remove-new-rig', function () {
    $(this).closest('tr').remove();
    if (!$('#addrowtbody .add-rig-row').length) {
        $('#btnSaveAll').hide().prop('disabled', true);
        $('#cancelbtn').hide();
    }
});

$(document).on('click', '.edit-rig-data', function () {
    openEditRigData($(this).data('id'));
});

$(document).on('click', '.delete-rig-data', function () {
    const id = $(this).data('id');
    openDeleteConfirmation('Are you sure you want to delete this Rig Data?', function () {
        deleteRigData(id);
    });
});

function deleteRigData(id) {
    $.ajax({
        url: '/rig_test/delete-rig-data/' + id + '/',
        type: 'DELETE',
        headers: { 'X-CSRFToken': csrf() },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status === 200) {
                successAlert(response.message || 'Rig Data deleted successfully.');
                loadRigData();
            } else warningAlert(response.message || 'Could not delete Rig Data.');
        },
        error: function (xhr) {
            hideLoader();
            warningAlert(xhr.responseJSON?.message || 'Could not delete Rig Data.');
        }
    });
}

$('#btnSaveAll').on('click', saveNewRigData);
$('#cancelbtn').on('click', function (e) {
    e.preventDefault();
    $('#addrowtbody').empty();
    $('#btnSaveAll').hide().prop('disabled', true);
    $('#cancelbtn').hide();
});


// ---------------- Attachments ----------------
function openDeleteConfirmation(message, onConfirm) {
    const modalBody = $('#delete_modal_body');
    modalBody.html(`
        <div class="avatar-md mx-auto mb-4">
            <div class="avatar-title bg-light text-danger fs-36 rounded-circle">
                <i class="ri-delete-bin-line"></i>
            </div>
        </div>
        <h5 class="mb-3">Delete Confirmation</h5>
        <p class="text-muted mb-4">${escapeHtml(message)}</p>
        <div class="hstack gap-2 justify-content-center">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteAction">Delete</button>
        </div>
    `);

    $('#confirmDeleteAction').off('click').on('click', function () {
        $('#deleteRecordModal').modal('hide');
        if (typeof onConfirm === 'function') onConfirm();
    });
    $('#deleteRecordModal').modal('show');
}

$(document).on('click', '.edit-attachment', function () {
    const fileUrl = $(this).data('file-url');
    const fileName = $(this).data('file-name');
    $('#edit_attachment_old_url').val(fileUrl);
    $('#edit_attachment_old_name').val(fileName);
    $('#edit_attachment_file').val('');
    $('#editAttachmentModal').modal('show');
});

$(document).on('click', '#saveAttachmentEdit', function () {
    const rigTestId = $('#pageElement').data('main-id');
    const oldUrl = $('#edit_attachment_old_url').val();
    const fileInput = $('#edit_attachment_file')[0];

    if (!fileInput || !fileInput.files.length) {
        warningAlert('Please select a replacement file.');
        return;
    }

    const formData = new FormData();
    formData.append('rig_test_id', rigTestId);
    formData.append('file_url', oldUrl);
    formData.append('attachment', fileInput.files[0]);

    $('#saveAttachmentEdit').prop('disabled', true);
    showLoader();
    $.ajax({
        url: '/rig_test/edit-attachment/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'X-CSRFToken': csrf() },
        success: function (response) {
            hideLoader();
            $('#saveAttachmentEdit').prop('disabled', false);
            if (response.status === 200) {
                successAlert(response.message || 'Attachment updated successfully.');
                $('#editAttachmentModal').modal('hide');
                setTimeout(function () { location.reload(); }, 400);
            } else {
                warningAlert(response.message || 'Could not update attachment.');
            }
        },
        error: function (xhr) {
            hideLoader();
            $('#saveAttachmentEdit').prop('disabled', false);
            warningAlert(xhr.responseJSON?.message || 'Could not update attachment.');
        }
    });
});

$(document).on('click', '.delete-attachment', function () {
    const fileUrl = $(this).data('file-url');
    const fileName = $(this).data('file-name') || 'this attachment';
    const row = $(this).closest('.attachment-row');

    openDeleteConfirmation('Are you sure you want to delete "' + fileName + '"?', function () {
        deleteAttachmentFromDetail(fileUrl, row);
    });
});

function deleteAttachmentFromDetail(fileUrl, row) {
    const formData = new FormData();
    formData.append('rig_test_id', $('#pageElement').data('main-id'));
    formData.append('file_url', fileUrl);

    showLoader();
    $.ajax({
        url: '/rig_test/delete-attachment/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'X-CSRFToken': csrf() },
        success: function (response) {
            hideLoader();
            if (response.status === 200) {
                successAlert(response.message || 'Attachment deleted successfully.');
                row.remove();
                if (!$('#attachment_list .attachment-row').length) {
                    $('#attachment_list').html('<p class="text-muted">No attachments</p>');
                }
            } else {
                warningAlert(response.message || 'Could not delete attachment.');
            }
        },
        error: function (xhr) {
            hideLoader();
            warningAlert(xhr.responseJSON?.message || 'Could not delete attachment.');
        }
    });
}
