import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import "./ManageProducts.css";


function ManageProducts(){

const [products,setProducts]=useState([]);

const navigate=useNavigate();


const loadProducts=()=>{

fetch("http://127.0.0.1:8000/api/products/")
.then(res=>res.json())
.then(data=>setProducts(data));

};


useEffect(()=>{

loadProducts();

},[]);



const deleteProduct=(id)=>{


fetch(
`http://127.0.0.1:8000/api/products/delete/${id}/`,
{
method:"DELETE"
}
)
.then(()=>loadProducts());


};



return(

<div className="manage">


<h1>
Manage Products
</h1>


<table>

<thead>

<tr>

<th>Image</th>
<th>Name</th>
<th>Category</th>
<th>Price</th>
<th>Actions</th>

</tr>

</thead>


<tbody>

{

products.map(product=>(


<tr key={product._id}>


<td>

<img 
src={product.image}
/>

</td>


<td>
{product.name}
</td>


<td>
{product.category}
</td>


<td>
₹{product.price}
</td>


<td>


<button
className="edit"
onClick={()=>
navigate(
`/admin/edit-product/${product._id}`
)
}
>
✏ Edit
</button>



<button
className="delete"
onClick={()=>
deleteProduct(product._id)
}
>
🗑 Delete
</button>


</td>


</tr>


))


}


</tbody>


</table>


</div>

);


}


export default ManageProducts;