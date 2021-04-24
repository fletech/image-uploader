window.addEventListener('load', function(){

     let main = document.querySelector('main');
     let headingContainer = document.querySelector('.heading-container')
     let content = document.querySelector('.content');
     let dropArea = document.querySelector('.drag-container');
     let buttonFile = document.querySelector('.button-file');
     let inputFile = document.querySelector('#inputFile');
     let contentUploaded = document.querySelector('.content-uploaded');
     let imagePreview = document.querySelector('#image-preview');
     let buttonSubmit = document.querySelector('.button-submit');

     
     let fileDragged;

     ///////////////// LISTENERS: /////////////////

     dropArea.addEventListener('dragover', function(e){
          e.stopPropagation();
          e.preventDefault();
          dropArea.classList.add('hover')
     });

     dropArea.addEventListener('dragleave', function(){
          dropArea.classList.remove('hover')
     });

     dropArea.addEventListener('drop', function(e){
          e.stopPropagation();
          e.preventDefault();
          
          fileDragged= e.dataTransfer
          readURL(fileDragged)
          inputFile.files = e.dataTransfer.files
     });

     buttonFile.addEventListener('click', function(e){
          e.stopPropagation();
          inputFile.click();

          inputFile.addEventListener("change", function(e){
               readURL(inputFile)
          })
     });

     buttonSubmit.addEventListener('click', function(e){
          e.preventDefault();

          if (fetchToApi() != "OK"){
               main.classList.add('border-none');
               main.innerHTML = `
               <div class="progress-bar-container">
                    <h2>Uploading...</h2>
                    <div class="progress-bar">
                         <div class="bar"></div>
                    </div>
               </div>`;
          }
          return false
     });


     ///////////////// FUNCTIONS: /////////////////

     const readURL = function(fileAdded) {
          if (fileAdded.files && fileAdded.files[0]) {
               let reader = new FileReader();
            
               reader.onload = function(e) {
                    let fileURL = reader.result
                    imagePreview.src = fileURL
                    content.classList.toggle('hidden');
                    headingContainer.classList.toggle('hidden');
                    contentUploaded.classList.remove('hidden');
               }
            
               reader.readAsDataURL(fileAdded.files[0]);// convert to base64 string
          }
     };


     const getFormData = function (){
          let inputText = document.querySelector('#imageName')

          if (inputText.value == ""){
               inputText.value = new Date().getTime()
          }
          let extension = inputFile.files[0].type.substr(inputFile.files[0].type.indexOf('/')+1)
          let inputValue = inputText.value.split(" ").join("")
          var formData = new FormData();
          //FormData() es un prototipo de objeto que puede enviar toda la info de un archivo y luego es el navegador quien distribuye files a Multer, y el body del form al controlador. 
          //Multer no recibe en este caso el req.body, solo el archivo que se envio. 
          // Para poder capturar el nombre del archivo que elige el cliente, se pasa como tercer parámetro en el append que hace referencia al archivo (input type="file"). 
          formData.append('imageUploaded', inputFile.files[0], inputValue);//esto viaja a Multer. 
          formData.append('imageName', `${inputValue}.${extension}`);// esto viaja al controlador dentro del "req.body"
          return formData;
     };


     const fetchToApi = async function (progress){
          
          try{
               const response = await fetch(
               "https://facundo-devchallenges.herokuapp.com/api/image-uploader", 
               {
                    method: 'POST',
                    body: getFormData()
               })
               const body = await response.json();
                    main.classList.remove('border-none')
                    main.innerHTML = `
                    <div class="uploaded-container">
                         <i class="fas fa-check-circle"></i>
                         <p class="heading">Uploaded successfully!</p>
                         <div class="image-container">
                              <!-- <img src=""> -->
                              <img class="image-success" src="${body.url}">
                         </div>
                         <div class="url-container">
                              <!-- <a href="${body.url}" readonly>Image</a> -->
                              <input class="link-tocopy" type="text" value="${body.url}" readonly><button class="btn-copy">Copy link</button>
                         </div>
                    </div>
                    `;
               let buttonCopy = document.querySelector('.btn-copy');
               buttonCopy.addEventListener('click', (e)=>{
                    e.preventDefault();
                    let linkToCopy = document.querySelector('.link-tocopy');
                    linkToCopy.select();
                    document.execCommand('copy');
               })
                    
               if(response.ok){
                    return response.statusText
               }
          }
          catch (error) {
               console.error('Error:', error)
          };

          // const response = await fetch(
          //      "http://localhost:3000/api/image-uploader", 
          //      {
          //           method: 'POST',
          //           body: getFormData()
          //      })
          // const body = await response.json();
          //           main.innerHTML = `<p>${body.url}</p>`;
     }

     
})