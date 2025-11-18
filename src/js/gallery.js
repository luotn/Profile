function loadPhotos()
{
    let photoCount = 13;
    let result = "";
    for(let i = 1; i <= photoCount; i++)
    {
        result += 
        "<div class='col'>" + 
        "   <a href='photos/" + i + ".JPG'>" + 
        "       <img src='thumbnails/" + i + ".JPG' class='w-100 shadow-1-strong rounded mb-4'>" +
        "   </a>" +
        "</div>";
    }
    document.getElementById("album").innerHTML = result;
}