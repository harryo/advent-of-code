class Conjunction {
  constructor(id, outputs) {
    this.id = id;
    this.outputs = outputs;
    this.inputs = {};
  }

  setInputs(inputs) {
    inputs.forEach((input) => {
      this.inputs[input] = false;
    });
  }

  receive(pulse, input) {
    this.inputs[input] = pulse;
    const allHigh = Object.values(this.inputs).every(Boolean);
    return this.outputs.map((output) => [this.id, !allHigh, output]);
  }
}

export default Conjunction;
