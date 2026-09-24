

// Use the same standard delete confirmation modal used throughout the Design pages.
function openDeleteConfirmation(message, onConfirm) {
    const modalBody = $('#delete_modal_body');
    if (!modalBody.length) {
        if (typeof onConfirm === 'function') onConfirm();
        return;
    }

    const escapedMessage = $('<div>').text(message || '').html();
    modalBody.html(`
        <div class="avatar-md mx-auto mb-4">
            <div class="avatar-title bg-light text-danger fs-36 rounded-circle">
                <i class="ri-delete-bin-line"></i>
            </div>
        </div>
        <h5 class="mb-3">Delete Confirmation</h5>
        <p class="text-muted mb-4">${escapedMessage}</p>
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

$(document).on('click', '#sub_btn', function (e) {
    e.preventDefault();

    const data = {
        type_of_testing:          $('#testrig_name').val().trim(),
        hw_sw:                    $('#testrig_hw_sw').val().trim(),
        version:                  $('#testrig_version').val().trim(),
        rig_date:                 $('#testrig_date').val(),
        pil_no:                   $('#testrig_pil_no').val().trim(),
        observation:              $('#testrig_observation').val().trim(),
        data_file_no:             $('#testrig_data_file_no').val().trim(),

        rig_test_description: CKEDITOR.instances.content.getData() || ""
      };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    const filesInput = $('#testrig_upload_attachment')[0];
    if (filesInput && filesInput.files.length > 0) {
        Array.from(filesInput.files).forEach(file => {
            formData.append('attachments', file, file.name);
        });
    }

    showLoader();
    $.ajax({
        url: '/rig_test/create-rig-test/',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,

        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
        },

        success: function (resp) {
            hideLoader();
            if (resp.status === 200) {
                successAlert(resp.message);
                if (CKEDITOR.instances.content)
                    CKEDITOR.instances.content.setData('');
                window.location.href = '/rig_test/pfr-add-test-rig-dashboard';
            } else {
                warningAlert('Error: ' + resp.message);
            }
        },
        error: function (xhr, status, err) {
            hideLoader();
            console.error(err);
            successAlert('Something went wrong – check the console.');
        },
    });
});


// Function to generate file attachment modal (similar to debrief dashboard)
function getRigTestFileModal(item) {
    let fileAttachmentArr = item.rig_test_uploads_info_lstofdct || [];
    let attachmentDiv = $('<div class="attachmentsDiv"></div>');

    if (fileAttachmentArr.length > 0) {
        $.each(fileAttachmentArr, function(index, dct) {
            let attachment = $(`
                <div class="card mb-1" style="background-color: #ececec;">
                    <div class="p-2">
                        <div>
                            <i class="ri-file-2-fill align-bottom"></i>
                            ${dct.viewable_in_browser ? `<a href="${dct.file_upload}" target="_blank">${dct.file_name}</a>` : dct.file_name}
                            <a style="float: right;" class="mx-2 download_file_rig_test_btn hover-hand2" data-file-url="${dct.file_upload}" data-file-name="${dct.file_name}"><i class="ri-download-fill align-bottom fs-15"></i></a>
                        </div>
                    </div>
                </div>
            `);
            attachmentDiv.append(attachment);
        });
    } else {
        attachmentDiv.html('No Files Found');
    }

    let fileModal = $(`
        <div class="modal fade" id="browsefiles_view_rig_${item._id}" tabindex="-1" aria-labelledby="exampleModalgridLabel" aria-modal="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body hotDebDashFileInputModalDiv" data-rig-test-row-id="${item._id}">
                        <div class="row mb-3">
                            <div class="col-lg-12">
                                <h6 class="modal-title mb-4" id="exampleModalgridLabel">Uploaded Files</h6>
                                ${attachmentDiv.prop('innerHTML')}
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="hstack gap-2 justify-content-end">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    return fileModal;
}


$(document).ready(function () {
    showLoader();
    $.ajax({
        url: '/rig_test/get-rig-test/',
        type: 'GET',
        dataType: 'json',
        success: function (resp) {
            hideLoader();
            console.log('Fetched rigs:========================================================', resp);

            const tbody = $('#Addrigtest');
            tbody.empty();
            if (Array.isArray(resp)) {
                resp.forEach((doc, idx) => {
                    const serial_number = resp.length - idx;
                    const hasFiles = doc.rig_test_uploads_info_lstofdct && doc.rig_test_uploads_info_lstofdct.length > 0;

                    const row = `<tr>
                                    <td>${serial_number}</td>
                                    <td><a href="/rig_test/rig_test_detail/${doc._id || ''}" class="text-primary fw-bold text-decoration-none">${doc.type_of_testing || ''}</a></td>
                                    <td>${doc.hw_sw || ''}</td>
                                    <td>${doc.rig_date ? new Date(doc.rig_date).toLocaleDateString() : ''}</td>
                                    <td>${doc.rig_test_description || ''}</td>
                                    <td>${doc.data_file_no || ''}</td>
                                    <td>${doc.pil_no || ''}</td>
                                    <td class="text-center">
                                        <a class="browsefilesModalBtnView" data-bs-toggle="modal" href="#browsefiles_view_rig_${doc._id}">
                                            <div style="transform: scale(1.4);">
                                                <span class="text-muted">
                                                    <i class="${hasFiles ? 'ri-file-copy-2-fill fileModalBtn' : 'ri-file-copy-2-line fileModalBtn'}" style="color: #000000;"></i>
                                                </span>
                                            </div>
                                        </a>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_modal_${doc._id}">
                                            <i class="ri-edit-2-fill fs-16 text-primary"></i>
                                        </a>
                                        <a href="javascript:void(0);" class="text-danger" onclick="openDeleteConfirmation('Are you sure you want to delete this Rig Test?', function(){ deleteRigTest('${doc._id}'); });">
                                            <i class="ri-delete-bin-5-fill fs-16"></i>
                                        </a>
                                    </td>
                                </tr>`;
                    tbody.prepend(row);

                    // Generate and append file modal
                    let fileModal = getRigTestFileModal(doc);
                    $(".page-content").append(fileModal);
                });
            } else if (resp.message) {
                warningAlert(resp.message);
            }
        },
        error: function (xhr, status, err) {
            hideLoader();
            console.error('GET /rig_test/get-rig-test/ failed:', err);
            warningAlert('Could not load rig tests – check the console.');
        }
    });
});

// Function to delete a rig test
function deleteRigTest(rigTestId) {
    showLoader();
    $.ajax({
        url: `/rig_test/delete-rig-test/${rigTestId}/`,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
        },
        success: function (resp) {
            hideLoader();
            if (resp.status === 200) {
                successAlert(resp.message);
                window.location.href = '/rig_test/pfr-add-test-rig-dashboard';
            } else {
                warningAlert('Error: ' + resp.message);
            }
        },
        error: function (xhr, status, err) {
            hideLoader();
            console.error('DELETE request failed:', err);
            warningAlert('Something went wrong – check the console.');
        }
    });
}

// Handle download file button click
$(document).on('click', '.download_file_rig_test_btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const fileUrl = $(this).data('file-url');
    const fileName = $(this).data('file-name');

    // Create a temporary anchor to trigger download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Function to populate edit modal with rig test data (when modal is shown)
$('#add_testrig').on('show.bs.modal', function (e) {
    // This is for the add modal, we'll handle edit modals separately
});

// Handle edit modal show event to populate data
$(document).on('show.bs.modal', '.modal[id^="edit_modal_"]', function (e) {
    const modal = $(this);
    const rigTestId = modal.attr('id').replace('edit_modal_', '');

    showLoader();
    $.ajax({
        url: `/rig_test/get-rig-test/`,
        type: 'GET',
        dataType: 'json',
        success: function (resp) {
            hideLoader();
            if (Array.isArray(resp)) {
                const rigTest = resp.find(doc => doc._id === rigTestId);
                if (rigTest) {
                    // Populate form fields
                    modal.find('input[name="type_of_testing"]').val(rigTest.type_of_testing || '');
                    modal.find('input[name="hw_sw"]').val(rigTest.hw_sw || '');
                    modal.find('input[name="version"]').val(rigTest.version || '');
                    modal.find('input[name="rig_date"]').val(rigTest.rig_date ? new Date(rigTest.rig_date).toISOString().split('T')[0] : '');
                    modal.find('input[name="pil_no"]').val(rigTest.pil_no || '');
                    modal.find('input[name="observation"]').val(rigTest.observation || '');
                    modal.find('input[name="data_file_no"]').val(rigTest.data_file_no || '');
                    modal.find('textarea[name="description"]').val(rigTest.rig_test_description || '');

                    // Store the ID for the submit button
                    modal.find('#sub_btn5_' + rigTestId).attr('data-rig-test-id', rigTestId);
                }
            }
        },
        error: function (xhr, status, err) {
            hideLoader();
            console.error('Failed to fetch rig test for editing:', err);
        }
    });
});

// Handle edit form submission
$(document).on('click', '.modal[id^="edit_modal_"] .btn-primary', function (e) {
    const btn = $(this);
    const modal = btn.closest('.modal');
    const rigTestId = btn.attr('data-rig-test-id');

    if (!rigTestId) {
        warningAlert('Could not identify rig test to update');
        return;
    }

    e.preventDefault();

    const form = modal.find('form');
    const data = {
        type_of_testing: form.find('input[name="type_of_testing"]').val().trim(),
        hw_sw: form.find('input[name="hw_sw"]').val().trim(),
        version: form.find('input[name="version"]').val().trim(),
        rig_date: form.find('input[name="rig_date"]').val(),
        pil_no: form.find('input[name="pil_no"]').val().trim(),
        observation: form.find('input[name="observation"]').val().trim(),
        data_file_no: form.find('input[name="data_file_no"]').val().trim(),
        rig_test_description: form.find('textarea[name="description"]').val().trim()
    };

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    // Handle file attachments
    const filesInput = modal.find('input[name="attachments"]')[0];
    if (filesInput && filesInput.files.length > 0) {
        Array.from(filesInput.files).forEach(file => {
            formData.append('attachments', file, file.name);
        });
    }

    showLoader();
    $.ajax({
        url: `/rig_test/update-rig-test/${rigTestId}/`,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
        },
        success: function (resp) {
            hideLoader();
            if (resp.status === 200) {
                successAlert(resp.message);
                modal.modal('hide');
                window.location.href = '/rig_test/pfr-add-test-rig-dashboard';
            } else {
                warningAlert('Error: ' + resp.message);
            }
        },
        error: function (xhr, status, err) {
            hideLoader();
            console.error('Update request failed:', err);
            warningAlert('Something went wrong – check the console.');
        }
    });
});