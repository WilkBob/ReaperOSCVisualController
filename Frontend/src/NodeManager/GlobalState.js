class GlobalState {
  constructor() {
    this.state = {
      time: 0,
      deltaTime: 0,
    };
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
  }

  updateTime(delta) {
    this.state.time += delta;
    this.state.deltaTime = delta;
  }
}

export default GlobalState;
