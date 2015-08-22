function showHideProduct(){
    var lightbox = $('#lightbox');

    if ($(lightbox).hasClass('active')){
        $('.imagebox').empty();
        $('.productbox').empty();
        $('#lightbox').css({
            display: 'none'
        });
        $(lightbox).removeClass('active');

    } else {

        $('#lightbox').css({
            display: 'block'
        });

        $('#lightbox .loading').css({
            display: 'block'
        });

        $(lightbox).addClass('active');
    }
}

function deleteElement(element) {
  $(element).remove();
}

function populateForm(data, rate) {

    // Set up data structure
    var form = $('#lightbox form');
    var imagebox = $('#lightbox form .imagebox');
    var productBox = $('#lightbox form .productbox');

    // Set up variables
    var images = data.images, select = data.select, tagsdata = data.tags;
    var options = '', imageGrid = '', tags = '', price;

    // Set up element containers
    var productElements = document.createElement('div');
    var imageElements = document.createElement('div');

    // Generate converted price in AUD from USD
    if (data.discountPrice != "" || typeof data.discountPrice !== 'undefined') {
        if (data.discountPrice.indexOf(" - ") > -1){
            var fromto = data.discountPrice.split(" - ");
            var amount = fromto[1]
        } else {
            var amount = data.discountPrice;
        }
    } else if (data.price.indexOf("0.00") !=- 1 ){
        if (data.price.indexOf("US") != -1){
            var unstripped = data.price;
            var amount = unstripped.replace('US $', '');

        } else {
            var amount = data.price;
        }

    }

    // Declare price
    price = rate * amount;

    // Generate product details
    // FOR EACH OPTION TYPE
    for (i=0; i < select.length; i++) {
        var optionValues = "";
        var optionType = select[i].type;
        console.log(optionType);
        // CHECK FOR TYPE AND CREATE OPTIONS
        if ((optionType.indexOf('Color') > -1) || (optionType.indexOf('color') != -1)){
            console.log('number of color options: ' + select[i].options.length);

            for (l=0; l < select[i].options.length; l++) {

                var id = select[i].options[l].id;
                var size = '', image = '', color = '';

                if (select[i].options[l].labelImage) {
                    var imagedata = (select[i].options[l].labelImage);
                    var src = imagedata.replace('.jpg_50x50.jpg', '.jpg');
                    image = '<img src="' + src + '" alt="' + color + '"></img>';
                }

                if (select[i].options[l].labelSize) {
                    size = '<input type="text" name="option[' + i + ']" value="' + select[i].options[l].labelSize + '"></input>';
                }

                if (select[i].options[l].labelColor) {
                    color = '<input type="text" name="option[' + i + ']" value="' + select[i].options[l].labelColor + '"></input>';
                }

                optionValues += '<div class="option" id="option-line-' + i + '-' + l + '">' +
                                    image +
                                    color +
                                    size +
                                    '<i class="material-icons delete-option" onClick="deleteElement(\'#option-line-' + i + '-' + l + '\')">&#xE872;</i>' +
                                    '<input type="hidden" name="option[' + i + ']" value="[\'' + id + '\', \'' + imagedata + '\']">' +
                                 '</div>';
            }
        } else if ((optionType.indexOf('Size') != -1) || (optionType.indexOf('size') != -1)) {
            console.log('number of size options: ' + select[i].options.length);
            for (l=0; l < select[i].options.length; l++) {
                var id = select[i].options[l].id;
                var size = select[i].options[l].labelSize;
                optionValues += '<div class="option" id="option-line-' + i + '-' + l + '">' +
                                    '<input type="text" name="option[' + i + ']" value="' + size + '"></input>' +
                                    '<i class="material-icons delete-option" onClick="deleteElement(\'#option-line-' + i + '-' + l + '\')">&#xE872;</i>' +
                                    '<input type="hidden" name="option[' + i + ']" value="[\'' + id + '\']">' +
                                 '</div>';
            }
        } else {
            optionValues += '<div><h3>Not a recognised option.</h3></div>';
        }

        options +=
        '<div class="option-line" id="option-identifier-' + i + '">' +
            '<h3>' +
                '<i class="material-icons delete-option" onClick="deleteElement(\'#option-identifier-' + i + '\')">&#xE872;</i>' +
                '<input type="text" name = "optionTitle' + i + '" value="' + optionType + '">' +
            '</h3>' + optionValues +
        '</div>';
    }

    // GENERATE IMAGE GRID
    for (x=0; x < images.length; x++) {

        // CREATE INDIVIDUAL IMAGE & INPUT

        var imagedata = images[x];
        var src = imagedata.replace('.jpg_50x50.jpg', '.jpg');
        imagelink = '<img src="' + src + '"></img>';
        imagedata = '<input type="hidden" name="images[]" value="' + src + '">';

        imageGrid +=
        '<div class="image-line" id="image-identifier-' + x + '">' +
                '<i class="material-icons delete-option" onclick="deleteElement(\'#image-identifier-' + x + '\')">&#xE872;</i>' +
                imagelink +
                imagedata +
        '</div>';
    }

    // GENERATE TAGS
    for (y=0; y < tagsdata.length; y++) {

        // CREATE INDIVIDUAL TAG & INPUT

        var content = tagsdata[y].content;
        var label = tagsdata[y].label.replace(':', ' : ');
        tag = '<input type="text" name="tags[]" value="' + label + content + '">';

        // Append individual tag to tags object
        tags +=
        '<div class="tag-line" id="tag-identifier-' + y + '">' +
                '<i class="material-icons delete-option" onclick="deleteElement(\'#tag-identifier-' + y + '\')">&#xE872;</i>' +
                tag +
        '</div>';
    }

    // Fill element containers
    productElements.innerHTML =
    '<input name="title" class="product-title" value="' + data.name + '" />' +
    '<h3 class="accordion-title">Tags<i href="#product-tags" class="fa fa-chevron-up accordion-button"></i></h3>' +
    '<div class="accordion-section active" id="product-tags">'+
        tags +
    '</div>' +
    '<h3 class="accordion-title">Options<i href="#product-options" class="fa fa-chevron-down accordion-button"></i></h3>' +
    '<div class="accordion-section" id="product-options">'+
        options +
     '</div>';

     imageElements.innerHTML =
     imageGrid +
     '<div class="product-highlights">' +
        '<input name="title" class="product-price" value="$' + Math.round(price * 100) / 100 + '" />' +
     '</div>';

     // Populate page with element containers
     $(productBox).append(productElements);
     $(imagebox).append(imageElements);
}

$(document).ready(function(){
    function deactivateAccordions(){
        $('.accordion-title i').removeClass('fa-chevron-up');
        $('.accordion-title i').addClass('fa-chevron-down');
        $('.accordion-section').slideUp('500');
        $('.accordion-section').removeClass('active');
    }

    $('.view-product').on('click', '.accordion-button', function(){
        var button = $(this);
        var target = $(button).attr('href');

        if ($(target).hasClass('active')){
            // deactivate
            deactivateAccordions();
        } else {
            //activate
            deactivateAccordions();

            $(button).removeClass('fa-chevron-down');
            $(button).addClass('fa-chevron-up');
            $(target).slideDown('500');
            $(target).addClass('active');
        }
    });
});
