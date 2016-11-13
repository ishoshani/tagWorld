
(function addTags(){

    var tag_array = ["https://visualhunt.com/photos/m/2/aerial-view-of-coffee-cup-with-milk-decoration.jpg", "https://visualhunt.com/photos/m/1/cat-scheu-cats-eyes-anxious-animal.jpg", "https://visualhunt.com/photos/m/1/blurred-motion-of-cars-on-street.jpg"];

    var div_wrapper = document.createElement('div');

    div_wrapper.setAttribute('class', 'tag');

    for(i = 0; i < tag_array.length; i++) {

        var tag_image = document.createElement('img');

        tag_image.setAttribute('src', tag_array[i]);

        tag_image.setAttribute('class', 'tag-image');

        div_wrapper.appendChild(tag_image);
    }

    document.getElementById('tag-area').appendChild(div_wrapper);

})();