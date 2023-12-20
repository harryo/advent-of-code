class FlipFlop {
  constructor(id, outputs) {
    this.id = id;
    this.outputs = outputs;
    this.state = false;
  }

  receive(pulse) {
    if (pulse) {
      return [];
    }
    this.state = !this.state;
    return this.outputs.map((output) => [this.id, this.state, output]);
  }
}

export default FlipFlop;
