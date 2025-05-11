import { Injectable } from '@nestjs/common';
import { Card } from '@dto/room';

@Injectable()
export class CardService {
  cardGenerate(rule: string, incAmount: string): Card[] {
    const num = 10;
    const newCards: Card[] = [];
    if (rule === 'standard') {
      for (let i = 0; i < num; i++) {
        newCards.push({ key: `card${i}`, value: `${i}` });
      }
    } else if (rule === 'fibonacci') {
      let a = 1,
        b = 2;
      for (let i = 0; i < num; i++) {
        newCards.push({ key: `card${i}`, value: `${a}` });
        const next = a + b;
        a = b;
        b = next;
      }
    } else if (rule === 'arithmetic') {
      let count = 0;
      for (let i = 0; i < num; i++) {
        count = count + parseInt(incAmount);
        newCards.push({ key: `card${i}`, value: `${count}` });
      }
    }
    newCards.push({ key: `coffee`, value: `coffee` });
    newCards.push({ key: `unknown`, value: `unknown` });
    return newCards;
  }
}
