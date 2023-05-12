import { Router } from "express";
import { getCustomers, getCustomersId, insertCustomer, updateCustomer } from "../controllers/customers.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersId);
customersRouter.post("/customers",validateSchema(customerSchema), insertCustomer);
customersRouter.put("/customers", updateCustomer);


export default customersRouter;