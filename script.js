
window.addEventListener('DOMContentLoaded', async (event) => {
    const CHUNK_SIZE = 20;
    let selectedCount = 0;
    let chunk = 0;

    const main = document.querySelector("main");
    const activeCountElement = document.createElement("p");

    const imageGalleryElement = document.createElement("div");
    imageGalleryElement.classList.add("image-gallery");

    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("button-wrapper");
    const loadMoreButton = document.createElement("button");
    loadMoreButton.classList.add("btn");
    loadMoreButton.innerText = "Load More"
    buttonWrapper.appendChild(loadMoreButton);

    [activeCountElement, imageGalleryElement, buttonWrapper].forEach(e => {
        main.appendChild(e);
    })

    const onImageSelected = (id) => {
        const imageEl = document.querySelector(`#image-${id} .card-body`);
        const wasAdded = imageEl.classList.toggle("active");
        selectedCount += wasAdded ? 1 : -1;
        updateActiveCount(selectedCount);
    }

    const renderImage = (imageAttr) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("card")
        wrapper.id = `image-${imageAttr.id}`
        wrapper.innerHTML = `
			<img src="${imageAttr.thumbnailUrl}" class="card-img" alt="..." />
			<div class="card-body">
				<h5 class="card-title">${imageAttr.title}</h5>
				<p class="card-text">
					Some quick example text to build on the card title and make up the bulk
					of the card's content.
				</p>
				<button href="#!" class="btn">Select</button>
			</div>
		`
        wrapper.querySelector("button").addEventListener("click", (e) => {
            onImageSelected(imageAttr.id);
            e.target.innerHTML = e.target.innerHTML == "Select" ? "Unselect" : "Select"
        });
        return wrapper;
    };


    const loadChunk = (imagesArr, chunkIndex) => {
        let template = []
        const slice = imagesArr.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE)
        for (let image of slice) {
            template.push(renderImage(image));
        }
        return template;
    }

    const updateActiveCount = (n) => {
        if (activeCountElement) {
            activeCountElement.innerText = `Active elements: ${n}`;
        }
    }

    const imagesRes = await fetch("https://jsonplaceholder.typicode.com/photos");
    const imagesJson = await imagesRes.json()

    loadChunk(imagesJson, chunk).forEach(e => imageGalleryElement.appendChild(e));

    updateActiveCount(selectedCount);

    loadMoreButton.addEventListener("click", (e) => {
        chunk++;
        if ((chunk - 1) * CHUNK_SIZE > imagesJson.length) {
            e.target.disabled = true;
        }
        loadChunk(imagesJson, chunk).forEach(e => imageGalleryElement.appendChild(e));
    })
});
