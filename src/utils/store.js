// 缓存类
class Store {
  constructor() {
    this.cached = {}
  }

  // 添加到缓存
  set(key, value) {
    this.cached[key] = value
  }

  // 获取缓存中数据
  get(key) {
    return this.cached[key]
  }

  // 删除缓存
  remove(key) {
    return delete this.cached[key]
  }
}

// 全局单例的缓存对象
const singleton = new Store()

export default {
  // 工厂方法，用于通过key创建一个缓存对象
  getStore(key) {
    let store = singleton.get(key)

    if (!store) {
      store = new Store()
      singleton.set(key, store)
    }

    return store
  },
  // 删除缓存对象, 会同时删除该缓存对象里面已缓存的数据
  removeStore(key) {
    return singleton.remove(key)
  }
}
