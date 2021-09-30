const form = document.getElementById("form");

if (form) form.addEventListener("submit", submitForm);

function submitForm(e) {
	e.preventDefault();
	const image = document.getElementById("image");

	const formData = new FormData();

	formData.append("image", image.files[0]);

	fetch("http://localhost:5000/upload_image", {
		method: "post",
		body: formData,
	})
		.then((res) => {
			alert("successful upload");
			image.value = ""
		})
		.catch((err) => ("Error occured", err));
}

function getImages() {
	fetch("http://localhost:5000/images")
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			const images = json.map((image) => {
				return `<div class="image">
                    <img src="${image.transformedUrl}" alt="${image.name}" />
                </div>`;
			});

			document.getElementById("image-container").innerHTML = images.join("");
		})
		.catch((err) => ("Error occured", err));
}
