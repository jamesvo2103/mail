document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#emails-detail').style.display = 'block';

  document.querySelector('#emails-detail').innerHTML = `
    <strong>From:</strong> ${email.sender}<br>
    <strong>To:</strong> ${email.recipients}<br>
    <strong>Subject:</strong> ${email.subject}<br>
    <strong>Timestamp:</strong> ${email.timestamp}<br>
    <hr>
    <p>${email.body}{/p}
  `;
});

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-detail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

 // Fetch emails for the selected mailbox
 fetch(`/emails/${mailbox}`)
 .then(response => response.json())
 .then(emails => {
   // Loop through emails and create div elements for each
   emails.forEach(singleEmail => {
     const newEmail = document.createElement('div');
     newEmail.className = 'List-group-item';
     newEmail.innerHTML = `
       <strong>From:</strong> ${singleEmail.sender}<br>
       <strong>Subject:</strong> ${singleEmail.subject}<br>
       <strong>Timestamp:</strong> ${singleEmail.timestamp}
     `;
     newEmail.classList.add('email-item'); // Optional: Add a class for styling
    
     newEmail.className = singleEmail.read ? 'read':'unread'; 
     // Add a click event listener
     newEmail.addEventListener('click', function() {
      view_email(singleEmail.id)
      });
     // Append the new email element to the view
     document.querySelector('#emails-view').append(newEmail);
   });
 })
 .catch(error => {
   console.error('Error fetching emails:', error);
 });
}

function send_email() {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  });
}
