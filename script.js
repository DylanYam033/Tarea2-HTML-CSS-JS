const sectionProducts = document.querySelector('.productList');
const sectionProductSale = document.querySelector('.saleProducts');

let ProductList = [];

// Obtener los datos del localStorage
const savedProductList = localStorage.getItem('productList');

// Asignar los datos al arreglo ProductList si existen
if (savedProductList) {
	ProductList = JSON.parse(savedProductList);
}

// ProductList.push({
//   codigo: "1",
//   nombre: "Computador",
//   precio: 3600000,
//   cantidad: 10,
//   imagen:
//     "https://img.freepik.com/psd-gratis/maqueta-psd-computadora-portatil-luz-led-degradada_53876-138283.jpg?w=1060&t=st=1679783043~exp=1679783643~hmac=ad0c4803ed92ddffb6ccbc294c446f26c6b66816343c8e8fbce71edaa5cd05f7",
// });

// ProductList.push({
//   codigo: "2",
//   nombre: "Celular",
//   precio: 360000,
//   cantidad: 10,
//   imagen:
//     "https://img.freepik.com/psd-gratis/mockup-smartphone_1310-812.jpg?w=1380&t=st=1679783208~exp=1679783808~hmac=566702cea6713401ecce9e77e5eb3fdb4bb050b06130f5dfc3228c915df50a46",
// });

function addProducts(
	codeProduct,
	nameProduct,
	priceProduct,
	quantityProduct,
	imgProduct
) {
	for (let i = 0; i < ProductList.length; i++) {
		if (ProductList[i].codigo === codeProduct) {
			alert(`El código ${codeProduct} ya existe en el arreglo`);
			return;
		}
	}
	let newProduct = {
		codigo: codeProduct,
		nombre: nameProduct,
		precio: priceProduct,
		cantidad: quantityProduct,
		imagen: imgProduct,
	};
	ProductList.push(newProduct);

	localStorage.setItem('productList', JSON.stringify(ProductList));
}

const btnSave = document.getElementById('btnEnviar');
btnSave.addEventListener('click', saveProduct);

function saveProduct(event) {
	event.preventDefault();
	const codigo = document.getElementById('code').value;
	const nombre = document.getElementById('name').value;
	const precio = document.getElementById('price').value;
	const cantidad = document.getElementById('quantity').value;
	const imagen = document.getElementById('image').value;

	if (
		codigo === '' ||
		nombre === '' ||
		precio === '' ||
		cantidad === '' ||
		imagen === ''
	) {
		alert('Todos los campos son requeridos');
		return;
	}

	try {
		const urlObj = new URL(imagen);
	} catch (error) {
		alert('El valor ingresado no es una URL válida');
		return;
	}

	addProducts(codigo, nombre, precio, cantidad, imagen);
	renderProducts(ProductList);

	document.getElementById('code').value = '';
	document.getElementById('name').value = '';
	document.getElementById('price').value = '';
	document.getElementById('quantity').value = '';
	document.getElementById('image').value = '';
}

function renderProducts(list) {
	sectionProducts.innerHTML = '';

	list.forEach((product) => {
		const article = document.createElement('article');
		article.classList.add('product-info');

		const div = document.createElement('div');
		div.classList.add('datos');

		const name = document.createElement('p');
		const code = document.createElement('p');
		const price = document.createElement('p');
		const quantity = document.createElement('p');
		const image = document.createElement('img');
		image.classList.add('foto');

		name.innerText = product.nombre;
		code.innerText = 'Codigo: ' + product.codigo;
		price.innerText = '$' + product.precio;
		quantity.innerText = 'Inventario: ' + product.cantidad;
		image.setAttribute('src', product.imagen);

		div.append(name, code, price, quantity);
		article.appendChild(div);
		article.appendChild(image);

		sectionProducts.appendChild(article);
	});
}

// Exporta los productos
const btnExport = document.getElementById('btnExportar');
btnExport.addEventListener('click', exportProducts);

function exportProducts() {
	if (ProductList.length > 0) {
		let datos = JSON.stringify(ProductList);

		const archivo = new Blob([datos], { type: 'application/json' });
		const url = URL.createObjectURL(archivo);

		const enlace = document.createElement('a');
		enlace.href = url;
		enlace.download = 'productos.json';
		enlace.click();
	} else {
		alert('No hay productos en el inventario');
	}
}

const buscarBtn = document.getElementById('btnBuscar');
buscarBtn.addEventListener('click', buscarProducto);
let producto;

function buscarProducto(event) {
	event.preventDefault();
	const codigo = document.getElementById('Vcodigo').value;
	producto = ProductList.find((prod) => prod.codigo === codigo);
	if (producto) {
		// Si se encontró el producto, se muestran sus datos
		renderProductSale(producto);
	} else {
		// Si no se encontró el producto, se muestra un mensaje de error
		alert('No se encontró el producto con el código ' + codigo);
	}

	document.getElementById('Vcodigo').value = '';
}

let listaVenta = [];
let listaProductosVenta = [];

function addLista(event) {
	event.preventDefault();
	const cantidadVender = document.getElementById('cantidad').value;
	if (
		parseInt(cantidadVender) > 0 &&
		parseInt(cantidadVender) <= parseInt(producto.cantidad)
	) {
		producto.cantidad = parseInt(producto.cantidad) - parseInt(cantidadVender);

		// fecha actual
		const fechaActual = new Date();
		const year = fechaActual.getFullYear();
		const month = fechaActual.getMonth() + 1;
		const day = fechaActual.getDate();

		const fechaFormateada = day + '/' + month + '/' + year;
		const precioTotal = parseInt(producto.precio) * parseInt(cantidadVender);

		let newVenta = {
			codigo: producto.codigo,
			cantidad: cantidadVender,
			total: precioTotal,
			fecha: fechaFormateada,
		};

		listaVenta.push(newVenta);
		listaProductosVenta.push(producto);

		renderProducts(ProductList);
		renderProductSale(producto);
	}
}

function ventaProductos(event) {
	event.preventDefault();
	if (listaVenta.length > 0) {
		let datos = JSON.stringify(listaVenta);

		const archivo = new Blob([datos], { type: 'application/json' });
		const url = URL.createObjectURL(archivo);

		const enlace = document.createElement('a');
		enlace.href = url;
		enlace.download = 'venta.json';
		enlace.click();
	} else {
		alert('No hay productos en la lista de la compra');
	}
}

function renderProductSale(product) {
	sectionProductSale.innerHTML = '';
	const article = document.createElement('article');
	article.classList.add('product-info');

	const div = document.createElement('div');
	div.classList.add('datos');

	const name = document.createElement('p');
	const code = document.createElement('p');
	const price = document.createElement('p');
	const quantity = document.createElement('p');
	const image = document.createElement('img');
	image.classList.add('foto');

	name.innerText = product.nombre;
	code.innerText = 'Codigo: ' + product.codigo;
	price.innerText = '$' + product.precio;
	quantity.innerText = 'Inventario: ' + product.cantidad;
	image.setAttribute('src', product.imagen);

	div.append(name, code, price, quantity);
	article.appendChild(div);
	article.appendChild(image);

	sectionProductSale.appendChild(article);

	// Crea la sectión y el formulario
	const section = document.createElement('section');
	const formulario = document.createElement('form');

	// Crea el label
	const label = document.createElement('label');
	label.textContent = 'Cantidad a vender:';

	// Crea el input
	const input = document.createElement('input');
	input.type = 'number';
	input.id = 'cantidad';
	input.name = 'cantidad';
	input.required = true;
	input.value = '0';

	// Crear button añadir a la lista de venta
	const btnAddListaVenta = document.createElement('button');
	btnAddListaVenta.type = 'submit';
	btnAddListaVenta.id = 'btnAddListaVenta';
	btnAddListaVenta.textContent =
		'Añadir a la lista (' + listaVenta.length + ')';

	// Agrega el label, el input y button al formulario
	formulario.appendChild(label);
	formulario.appendChild(input);
	formulario.appendChild(btnAddListaVenta);
	//formulario.appendChild(btnConfirmarVenta);

	// Agrega la section al formulario
	section.appendChild(formulario);

	// Agrega la sección al elemento padre
	sectionProductSale.appendChild(section);

	// titulo lista de compra
	const tituloLista = document.createElement('h2');
	tituloLista.innerText = 'Lista de Compra';

	// Crear un button confirmar venta
	const btnConfirmarVenta = document.createElement('button');
	btnConfirmarVenta.type = 'submit';
	btnConfirmarVenta.id = 'btnConfirmarVenta';
	btnConfirmarVenta.textContent = 'Vender';

	// se añade el titulo el botton de confirmar compra a la sección sectionProductSale
	sectionProductSale.appendChild(tituloLista);
	sectionProductSale.appendChild(btnConfirmarVenta);

	// crea la seccion
	const sectionLista = document.createElement('section');
	sectionLista.classList.add('productList');

	sectionLista.innerHTML = '';
	let i = 0;
	listaProductosVenta.forEach((product) => {
		console.log(product);
		const article = document.createElement('article');
		article.classList.add('product-info');

		const div = document.createElement('div');
		div.classList.add('datos');

		const name = document.createElement('p');
		const code = document.createElement('p');
		const price = document.createElement('p');
		const quantity = document.createElement('p');
		const image = document.createElement('img');
		image.classList.add('foto');

		name.innerText = product.nombre;
		code.innerText = 'Codigo: ' + product.codigo;
		price.innerText = '$' + product.precio;
		quantity.innerText = 'Cantidad: ' + listaVenta[i].cantidad;
		image.setAttribute('src', product.imagen);

		div.append(name, code, price, quantity);
		article.appendChild(div);
		article.appendChild(image);

		sectionLista.appendChild(article);
		i += 1;
	});

	sectionProductSale.appendChild(sectionLista);

	const btnAddLista = document.getElementById('btnAddListaVenta');
	btnAddLista.addEventListener('click', addLista);

	const btnVender = document.getElementById('btnConfirmarVenta');
	btnVender.addEventListener('click', ventaProductos);
}

renderProducts(ProductList);
