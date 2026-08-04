import {Link} from "react-router-dom";
import "./AdminDashboard.css";


function AdminDashboard(){


return(

<div className="admin-dashboard">


<h1 className="admin-title">
CodeX Accessories Admin Panel
</h1>


<div className="dashboard-cards">


<div className="dashboard-card">

<h2>📦</h2>

<h3>Manage Products</h3>

<Link to="/admin/manage-products">

<button>
Open
</button>

</Link>

</div>



<div className="dashboard-card">

<h2>➕</h2>

<h3>Add Product</h3>


<Link to="/admin/add-product">

<button>
Add
</button>

</Link>

</div>



<div className="dashboard-card">

<h2>🛒</h2>

<h3>Orders</h3>


<Link to="/admin/orders">

<button>
View Orders
</button>

</Link>


</div>


</div>


</div>

)

}


export default AdminDashboard;