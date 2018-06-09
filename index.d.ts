import { Model, DvaInstance, Router } from 'dva'

type Container = string | HTMLElement
type ModelWrapper = (model: Model) => Model
type RouterWrapper = (router: Router) => Router
type ErrorHandler = (error: Error) => any
interface NodeModule extends __WebpackModuleApi.Module {}
interface DvaHot {
  patch(app: DvaInstance, container?: Container): DvaInstance
  model(srcModule: NodeModule, handleError?: ErrorHandler): ModelWrapper
  router(srcModule: NodeModule, handleError?: ErrorHandler): RouterWrapper
  setContainer(container: Container): HTMLElement
  onModelError(handleError: ErrorHandler): void
}

declare var hot: DvaHot
export = hot
