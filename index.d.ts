import { Model, DvaInstance, Router } from './dva'

type AcceptModel = (model: Model) => Model
type AcceptRouter = (router: Router) => Router
interface NodeModule extends __WebpackModuleApi.Module {}
interface dvaHot {
  patch(app: DvaInstance): DvaInstance
  model(srcModule: NodeModule): AcceptModel
  router(srcModule: NodeModule): AcceptRouter
}
declare var hot: dvaHot
export default hot
