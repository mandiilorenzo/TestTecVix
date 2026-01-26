import { Router } from "express";
import { VMController } from "../controllers/VMController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
// import { isManagerOrIsAdmin } from "../authUser/isManagerOrIsAdmin";
// import { isAdmin } from "../authUser/isAdmin";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.VM; // /api/v1/vm

const vMRoutes = Router();

vMRoutes.use(ensureAuthenticated);

export const makeVMController = () => {
  return new VMController();
};

const vMController = makeVMController();

// ========= GETs =========
vMRoutes.get(BASE_PATH, async (req, res) => {
  await vMController.listAll(req, res);
});

vMRoutes.get(`${BASE_PATH}/:idVM`, async (req, res) => {
  await vMController.getById(req, res);
});

// ========= POSTs =========
vMRoutes.post(
  BASE_PATH,
  // isManagerOrIsAdmin,
  async (req, res) => {
    await vMController.createVM(req, res);
  },
);

vMRoutes.post(`${BASE_PATH}/:idVM/start`, async (req, res) => {
  await vMController.startVM(req, res);
});

vMRoutes.post(`${BASE_PATH}/:idVM/stop`, async (req, res) => {
  await vMController.stopVM(req, res);
});

// ======== PUTs =========

vMRoutes.put(
  `${BASE_PATH}/:idVM`,

  //isManagerOrIsAdmin,
  async (req, res) => {
    await vMController.updateVM(req, res);
  },
);

// ======== DELETEs ========
vMRoutes.delete(`${BASE_PATH}/:idVM`, async (req, res) => {
  await vMController.deleteVM(req, res);
});

export { vMRoutes };
