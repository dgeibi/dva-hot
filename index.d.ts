import { Model, DvaInstance, Router } from './dva'

type Container = string | HTMLElement
type ModelWrapper = (model: Model) => Model
type RouterWrapper = (router: Router) => Router
interface NodeModule extends __WebpackModuleApi.Module {}
interface DvaHot {
  patch(app: DvaInstance, container?: Container): DvaInstance
  model(srcModule: NodeModule): ModelWrapper
  router(srcModule: NodeModule): RouterWrapper
  setContainer(container: Container): HTMLElement
}

declare var hot: DvaHot
export default hot
