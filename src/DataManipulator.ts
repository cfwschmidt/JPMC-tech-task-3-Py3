import { ServerRespond } from './DataStreamer';

// the interface defining what a Row object will look like
// this interface is used by the generateRow static function of the DataManipulator defined below.
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // serverRespond  includes an element for both the ABC and DEF stocks. 
    // To determine the ratios and alert triggers we perform calculations using both of these elements
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.025;
    const lowerBound = 1 - 0.025;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // Use whichever timestamp (ABC or DEF quote) is earliest
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      // If the ratio is above or below the bounds, the trigger alert equals the ratio, other times it's just undefined.
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ?  ratio : undefined,
    }
  }
}
