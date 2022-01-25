import React from "react";
import TableItems from "./TableItems";
import "./Table.css";

function Table(props) {
  const users = props.users;
  let i = 0;
  return (
    <table cellSpacing={0}>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>email</th>
          {/* <th>orders</th>
          <th>status</th>
          <th>created at</th>
          <th>last logged in</th> */}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return (
            <TableItems
              key={i++}
              user={user}
              handleControls={props.handleControls}
              userAuth={props.userAuth}
            />
          );
        })}
      </tbody>
      <tfoot></tfoot>
    </table>
  );
}

export default Table;
