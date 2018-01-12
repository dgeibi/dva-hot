import { Model, DvaInstance, Router } from './dva'

type ModelWrapper = (model: Model) => Model
type RouterWrapper = (router: Router) => Router
interface NodeModule extends __WebpackModuleApi.Module {}
interface DvaHot {
  patch(app: DvaInstance): DvaInstance
  model(srcModule: NodeModule): ModelWrapper
  router(srcModule: NodeModule): RouterWrapper
}

declare var hot: DvaHot
export default hot
