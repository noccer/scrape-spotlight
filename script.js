// Thank you to spotlight.it-notes.ru for leaving your WordPress API endpoints open. I just wanted to show more than 5 pictures per page. Hope this doesn't hammer your server too much!

const imageContainer = $('images');

const pageSize = 100;
const url = 'https://spotlight.it-notes.ru/wp-json/wp/v2/posts?per_page=' + pageSize;

let counter = 0;
let totalPosts;
let totalRemainingPosts;

const getImageString = (item) => {
    const elementData = item.content.rendered;
    const splitElementData = elementData.split(' src="');
    const imageStringBase = splitElementData[1].split('" alt="');
    const finalImageString = imageStringBase[0];

    return finalImageString;
}

const dataCallback = (data) => {
    if (data) {
        $('#button').remove();
        for (let i = 0; i < data.length; i++) {
            const finalImageString = getImageString(data[i]);

            const link = data[i].link;
            
            const aTag = $('<a>')
                            .attr('target', '_blank')
                            .attr('href', link)
                            .attr('title', 'Click to open image in new tab');

            const image = $('<img>').attr('src', finalImageString);
            aTag.append(image);
            $('#images').append(aTag);
        }
    }
}

const getImageData = () => {
    if (counter === 0) {
        counter++;
        var getUrl;
        getUrl = $.ajax({
            url,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                totalPosts = getUrl.getResponseHeader('x-wp-total');
                totalRemainingPosts = totalPosts - pageSize; // TODO: fetch all 1600+ posts by making api calls, 100 at a time (WordPress limits 100 posts per call).
                dataCallback(data);
            }
        });
    }
}

$('#button').on('click', getImageData);