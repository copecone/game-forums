var randCount = 0;

loaded = () => {
    function isValidURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }

    fetch("src/data/levels.json", {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((result) => {
        showMaps(result)
    }).catch((err) => console.log(err))

    function showMaps(data) {
        var mapSection = document.querySelector(".maps")

        Object.keys(data).forEach((level) => {
            var mapElem = document.createElement("div")
            
            var mapThumbnail = document.createElement("div")
            var thumbnailImg = document.createElement("img")

            if (!isValidURL(data[level].thumbnail)) {
                thumbnailImg.dataset.asyncSrc = "src/data/{0}/{1}".format(level, data[level].thumbnail)
            } else {
                thumbnailImg.dataset.asyncSrc = "{0}?{1}".format(data[level].thumbnail, sha384(randCount.toString()))
                randCount++
            }

            thumbnailImg.setAttribute("alt", "thumbnail")
            mapThumbnail.appendChild(thumbnailImg)
            mapThumbnail.classList.add("thumbnail")

            mapElem.appendChild(mapThumbnail)
            var artistElem = document.createElement("item")
            var artistInfo = document.createElement("info-tag"); artistInfo.innerText = "Artist"
            var musicElem = document.createElement("item")
            var musicInfo = document.createElement("info-tag"); musicInfo.innerText = "Music"
            var creatorElem = document.createElement("item")
            var creatorInfo = document.createElement("info-tag"); creatorInfo.innerText = "Creator"
            var diffElem = document.createElement("item")
            var diffInfo = document.createElement("info-tag"); diffInfo.innerText = "Difficulty"
            
            artistElem.appendChild(artistInfo)
            musicElem.appendChild(musicInfo)
            creatorElem.appendChild(creatorInfo)
            diffElem.appendChild(diffInfo)

            artistElem.append("{0}".format(data[level].artist))
            musicElem.append("{0}".format(data[level].music))
            creatorElem.append("{0}".format(data[level].creator))
            diffElem.append("{0}".format(data[level].difficulty.toFixed(2)))
            
            mapSection.appendChild(mapElem)
            thumbnailImg.addEventListener("load", (event) => {
                mapElem.classList.add("map-block")
                thumbnailImg.style.maxWidth = "100%"
                thumbnailImg.style.maxHeight = "100%"

                mapElem.appendChild(artistElem)
                mapElem.appendChild(musicElem)
                mapElem.appendChild(creatorElem)
                mapElem.appendChild(diffElem)
            })
        })
    }

    try {
        // Mozilla/5.0 (Windows; U; Windows NT 10.0; en-US; Valve Steam GameOverlay/1642451672; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36
        if (navigator.userAgent.match(/; en-US; Valve Steam (Tenfoot|GameOverlay)\/[0-9]*; \)/gm)) {
            var infoTag = document.createElement("info-tag"); infoTag.innerText = "Steam에서 이용하고 계시네요!"
            
            infoTag.classList.add("display-block")
            infoTag.classList.add("center")
            infoTag.style.marginTop = "2.8vh"

            document.querySelector("#app").insertBefore(infoTag, document.querySelector("#app").children[1])
        }
    } catch (error) {
        document.write(error)
    }
}

document.addEventListener("DOMContentLoaded", loaded)

if (document.readyState === "interactive") {
    loaded()
}