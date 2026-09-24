function clearinput(inputId) {
    const el = document.getElementById(inputId);
    if (el) el.value = '';           
}





// function submitFormAddTestrig() {
//     const form = document.getElementById('submitform');
//         var editor = CKEDITOR.instances['content'];
//         var contentValue = editor.getData();
//         console.log('contentValue', contentValue);
//         let formData = new FormData(form)
//         formData.append('description', contentValue);
//         formData.forEach((value, key) => {
//         console.log(`Form Data: ${key} = ${value}`);
//         });


// function clearInput() {
//     document.getElementById('upload_attachment').value = ''
// }

  
//  showLoader(); 
//   $.ajax({
//     url: `/Design/add-new-testrig/`,
//     method: "POST",
//     processData: false,
//     contentType: false,
//     headers: { 'X-CSRFToken': csrfToken },
//     data: formData, // Change 'body' to 'data'
//     success: function (response) {
//       if (response.status == 200) {
//         successAlert(response.message);
//         location.reload();
//         hideLoader(); 
//       } else {
//         warningAlert(response.message);
//         hideLoader();
//       }
//     },
//     error: function (xhr, status, error) {
//       console.log("Error:", error);
//       hideLoader();
//     },
//   });
//   }






// async function submitFormAddTestrig() {
//     const form      = document.getElementById('submitform');
//     const btnSubmit = document.getElementById('sub_btn');

    
//     if (!form.checkValidity()) {          
//         form.reportValidity();            
//         return;                           
//     }

    
//     const data = new FormData(form);

//     description = CKEDITOR.instances.content.getData();
//     console.log(description,"=====================================")
//     data.append("rig_test_description",description)

//     console.groupCollapsed('FormData contents');
//     for (const [key, value] of data.entries()) {
//         if (value instanceof File) {
//             console.log(`- ${key} (File) : ${value.name}, size=${value.size}`);
//         } else {
//         console.log(`- ${key} : "${value}"`);
//     }
//   }
//   console.groupEnd();
//     /* If you kept the original “name='name'” everywhere,
//        uncomment the block below to force proper field names:
//      -------------------------------------------------------
//       data.set('type_of_testing', document.getElementById('testrig_name').value);
//       data.set('hardware_software', document.getElementById('testrig_hw_sw').value);
//       data.set('version',          document.getElementById('testrig_version').value);
//       data.set('date',             document.getElementById('testrig_date').value);
//       data.set('pil_no',           document.getElementById('testrig_pil_no').value);
//       data.set('observation',      document.getElementById('testrig_observation').value);
//       data.set('data_file_no',     document.getElementById('testrig_data_file_no').value);
//       // Attachments are already added automatically because the input name is "attachments".
//     ------------------------------------------------------- */

//     // 3️⃣ Disable button to avoid double‑clicks, show a spinner
//     btnSubmit.disabled = true;
//     const originalText = btnSubmit.innerHTML;
//     btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
//     console.log(data,"data========================================================================================================================")

//     try {
//         // 4️⃣ Send the POST request
//         const response = await fetch('/Rig_test/create-rig-test/', {      // <-- change URL if needed
//             method: 'POST',
//             body: data,               // browser sets correct Content‑Type for FormData
//             // If you need a CSRF token (e.g., Django/Flask) add it here:
//             // headers: { 'X-CSRF-Token': csrfToken }
//         });

//         const result = await response.json();  // assuming JSON reply

//         if (!response.ok) {
//             // API returned an error status
//             throw new Error(result.message || `Server error (${response.status})`);
//         }

//         // 5️⃣ Success – maybe close modal and refresh table, etc.
//         alert('Test rig saved successfully!');
//         // e.g., close the Bootstrap modal:
//         const modalEl = document.querySelector('#submitform').closest('.modal');
//         if (modalEl) new bootstrap.Modal(modalEl).hide();

//         // Optionally reset form
//         form.reset();
//     } catch (err) {
//         console.error(err);
//         alert(`Could not save the test rig: ${err.message}`);
//     } finally {
//         // Re‑enable button and restore text
//         btnSubmit.disabled = false;
//         btnSubmit.innerHTML = originalText;
//     }
// }

    



// (function () {


//   const csrfToken = (function () {
//     const meta = document.querySelector('meta[name="csrf-token"]');
//     return meta ? meta.getAttribute('content') : window.csrfToken || '';
//   })();


/* 

$(document).on('click', '#sub_btn', function (e) {
    e.preventDefault();                    
    const data = {
      type_of_testing: $('#testrig_name').val().trim(),
      hw_sw: $('#testrig_hw_sw').val().trim(),
      version: $('#testrig_version').val().trim(),
      rig_date: $('#testrig_date').val(),          // yyyy-mm-dd
      pil_no: $('#testrig_pil_no').val().trim(),
      observation: $('#testrig_observation').val().trim(),
      data_file_no: $('#testrig_data_file_no').val().trim(),
      rig_test_description: $('#content').val() || $('#content').html(), // rich‑text or plain
    };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });

    // file attachments – can be multiple
    const filesInput = $('#testrig_upload_attachment')[0];
    if (filesInput && filesInput.files.length > 0) {
      Array.from(filesInput.files).forEach((file) => {
        formData.append('attachments', file, file.name);
      });
    }

    $('#sub_btn').prop('disabled', true);
    showLoader2('add_testrig_form_submit');

    $.ajax({
      url: '/Rig_test/create-rig-test/',          // <-- YOUR API endpoint
      type: 'POST',
      data: formData,
      contentType: false,                 // let the browser set it (multipart/form‑data)
      processData: false,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRFToken', csrfToken);  // Django style header
      },

      success: function (response) {
        hideLoader2('add_testrig_form_submit');
        $('#sub_btn').prop('disabled', false);

        if (response.status === 200) {            // backend should return JSON {status, message}
          successAlert(response.message || 'Test rig added successfully.');
          $('#add_testrig').modal('hide');         // close modal
          resetAddTestrigForm();                   // optional helper to clear inputs

          // If you keep a list of rigs in the page – refresh it:
          // fetchRigsList();  // your own function
        } else {
          warningAlert('Error: ' + (response.message || 'Unknown error.'));
        }
      },

      error: function (xhr, status, err) {
        hideLoader2('add_testrig_form_submit');
        $('#sub_btn').prop('disabled', false);
        console.error('AJAX error:', err);
        warningAlert('Something went wrong – please try again.');
      },
    });
  });



*/


//   function resetAddTestrigForm() {
//     $('#submitform')[0].reset();                     // resets text fields and file input
//     // If you use a rich‑text editor, clear it here:
//     if (window.summernote) {
//       $('#content').summernote('reset');
//     }
//   }

//   /* ------------------------------------------------------------------
//      Optional: hide loader implementation
//    -------------------------------------------------------------------*/
//   function showLoader2(id) { /* implement per your UI library */ }
//   function hideLoader2(id) { /* implement per your UI library */ }

// })();









