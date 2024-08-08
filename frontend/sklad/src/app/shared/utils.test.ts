import Utils from "./utils.service";

describe('Utils', () => {
  it('Hex to Decimal', () => {
    expect(Utils.hexToInteger('#ffffff')).toEqual(16777215);
  });

  it('Decimal to Hex', () => {
    expect(Utils.integerToHex(0)).toEqual('#000000');
    expect(Utils.integerToHex(16777215)).toEqual('#ffffff');
  });
  
  it('Hex to RGB', () => {
    expect(Utils.hexToRgb('#ff00ff')).toEqual({r: 255, g: 0,b: 255 });
  });

  it('Luminance', () => {
    expect(Utils.luminance(0, 0, 254))
    .toBeCloseTo(0.07155757141161852, 0.000000001);
  });

  describe('Font color function', () => {
    it('Check contrast 1', () => {
      expect(Utils.getFontColor('888888')).toEqual('black');
    });

    it('Check contrast 2', () => {
      expect(Utils.getFontColor('757579')).toEqual('white');
    });
  })

  describe('Color by order', () => {
    it('Order 0', () => {expect(Utils.colorByOrder(0)).toEqual('crimson')});
    it('Order 1', () => {expect(Utils.colorByOrder(1)).toEqual('gold')});
    it('Order 2', () => {expect(Utils.colorByOrder(2)).toEqual('limegreen')});
    it('Order 3', () => {expect(Utils.colorByOrder(3)).toEqual('lightskyblue')});
    it('Order 4', () => {expect(Utils.colorByOrder(4)).toEqual('royalblue')});
    it('Order 5', () => {expect(Utils.colorByOrder(5)).toEqual('darkviolet')});
    it('Order 11', () => {expect(Utils.colorByOrder(11)).toEqual('darkviolet')});
  })

})