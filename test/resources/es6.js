'use strict';

export default () => {
  return 'main';
};

export var one = 1;

export var two = () => {
  return 2;
};

export var isMoreOdd = () => {
  var moreOdd = 0;
  var numbers = [ 5, 8, 2, 3 ];

  numbers.forEach((number) => {
    if (number & 1) {
      moreOdd++;
    }
    else {
      moreOdd--;
    }
  });

  return (moreOdd > 0);
};
