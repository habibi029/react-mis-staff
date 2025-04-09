import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { cart, totalAmount } = props;
  return (
    <div ref={ref} className="p-5">
      <h2>Invoice</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((cartServices) => (
              <tr key={cartServices.id}>
                <td>{cartServices.id}</td>
                <td>{cartServices.name}</td>
                <td>{cartServices.price}</td>
                <td>{cartServices.quantity}</td>
                <td>{cartServices.totalAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No items in the cart</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Total Amount: ₱{totalAmount}</h3>
    </div>
  );
});
