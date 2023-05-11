import { Router } from "express";
import { getCustomers, getCustomersId, insertCustomer, updateCustomer } from "../controllers/customers.controllers";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersId);
customersRouter.post("/customers", insertCustomer);
customersRouter.put("/customers", updateCustomer);


export default customersRouter;