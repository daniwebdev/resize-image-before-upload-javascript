/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}


$('#file').change(function() {

    //Baca file dari input
    let file = $(this)[0].files[0]

    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (readEvent) => {

        let target = readEvent.target;

        let image = new Image();
        image.onload = (imageEvent) => {

            let def_width = 300;
            let def_percent = (def_width / image.width) * 100;

            let canvas = document.createElement('canvas');
            let width = def_width;
            let height = image.height * (def_percent / 100);

            canvas.width = width;
            canvas.height = height;

            // canvas.getContext('2d').drawImage()
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);

            let dataURL = canvas.toDataURL(file.type);

            // console.log(dataURL);

            let formdata = new FormData();
            let blobImage = dataURLToBlob(dataURL);

            formdata.append('file', blobImage, `resized-image_${file.name}`);


            $('#preview').attr('src', dataURL);

            $.ajax({
                type: "POST",
                url: "./upload.php",
                success: function(data) {
                    // your callback here
                    console.log(data);
                },
                error: function(error) {
                    // handle error
                },
                async: true,
                data: formdata,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });

        }

        image.src = target.result

    }
})