const example1 = [[240, 360, 720], [360, 720], [1080]];
const example2 = [[240, 720], [360, 720], [1080]];
const example3 = [[240], [360, 720], [1080]];
const example4 = [[240, 360, 720], [240, 360, 720, 1080], [240, 360]];
const example5 = [[240, 720], [240, 360, 720, 1080], [240, 720]];
const example6 = [[240, 720], [240, 360, 1080], [240, 360]];
const example7 = [[720], [240, 360, 1080], [240, 360]];
const example8 = [[240, 360], [240, 360], [720, 1080]];

const example9 = [[240, 360, 720], [360, 'any'], [360, 720]];
const example10 = [[240, 360, 720], [240, 360, 720], ['any', 720]];
const example11 = [[240, 360, 720], [360, 1080], ['any', 720]];
const example12 = [[240, 360, 720], [1080], ['any', 720]];

const attempt = (available = [], allowed = [], preferred = []) => {
  if (!available.length || !allowed.length || !preferred.length) {
    return [];
  }

  let result = [];

  // exclude all elements that are not allowed
  let filtered = [];

  // get all available items only for 'any' - 'any':number[]
  let anyAllowed = [];

  // all elements that are allowed and preferred - available = number[]:allowed && preferred
  const filteredAndPreferred = [];

  // elements that are not preferred but allowed
  let remainingFiltered = [];

  // just avoid mutation - can be considered as extra action
  let remainingPreferred = [...preferred];

  // further processing of remainingFiltered array
  const filteredAndNotPreferred = [];

  if (allowed.includes('any')) {
    // array with 'any' become available and allowed
    filtered = [...allowed];
    // get all available items for any, but exclude that are already presented in array
    anyAllowed = available.filter((el) => !allowed.includes(el));
  } else {
    // get all available and allowed items
    filtered = available.filter((el) => allowed.includes(el));
  }

  // if all available items are not allowed
  if (!filtered.length) {
    return [];
  }

  // compare each filtered - available + allowed item with preferred
  for (let i = 0; i < filtered.length; i++) {
    // in case if we have 'any' in allowed
    if (filtered[i] === 'any' && anyAllowed.length) {
      let addToRemainingFiltered = true;
      // 'any' has extra array - [ number, any:number[] ], e.g. [360, 'any':[240,720]]
      for (let j = 0; j < anyAllowed.length; j++) {
        addToRemainingFiltered = true;
        // check each 'any'-item presentation in preferred
        const filteredIndex = remainingPreferred.indexOf(anyAllowed[j]);
        if (filteredIndex !== -1) {
          // remove element from preferred array and insert it into filteredAndPreferred
          remainingPreferred.splice(filteredIndex, 1);
          filteredAndPreferred.push(anyAllowed[j]);
          addToRemainingFiltered = false;
          // each 'any' item in allowed permit only one item for further proceedings
          break;
        }
      }
      // if all 'any' items are not preferred insert them to respective array
      if (addToRemainingFiltered) {
        remainingFiltered = [...remainingFiltered, ...anyAllowed];
      }
    } else {
      let addToFiltered = true;
      // if filtered-allowed item is preferred insert it into filteredAndPreferred and remove from preferred
      remainingPreferred = remainingPreferred.filter((el) => {
        if (filtered[i] === el) {
          filteredAndPreferred.push(filtered[i]);
          addToFiltered = false;
          return false;
          // if 'any' element is found in preferred each filtered-allowed item insert into filteredAndPreferred,
          // but not remove 'any' from preferred for subsequent iterations
        } else if (el === 'any' && !remainingPreferred.includes(filtered[i])) {
          filteredAndPreferred.push(filtered[i]);
          addToFiltered = false;
          return true;
        }
        return true;
      });
      // if filtered-allowed item is not preferred insert it to respective array
      if (addToFiltered) {
        remainingFiltered.push(filtered[i]);
      }
    }
  }

  // if there are no items for further proceedings return current result
  if (!remainingPreferred.length || !remainingFiltered.length) {
    return [...filteredAndPreferred];
  }

  // in this stage each available+allowed+preferred item are found,
  //	any proceedings are with available+allowed but not preferred items.

  // search for each remaining preferred item any appropriate item in remaining available+allowed array
  for (let i = 0; i < remainingPreferred.length; i++ ) {
    let belowPreffered = true;
    for (let j = 0; j < remainingFiltered.length; j++) {
      // if item is bigger than preffered one we add it to further procedures
      // and remove this item from filer list to avoid dublications
      if (remainingFiltered[j] > remainingPreferred[i]) {
        filteredAndNotPreferred.push(remainingFiltered.splice(j, 1)[0]);
        belowPreffered = false;
        break;
      }
    }
    // if all items are smaller than preffered one take the first one
    if (belowPreffered) {
      filteredAndNotPreferred.push(remainingFiltered.splice(0, 1)[0]);
    }
  }

  // if several items are complying with the rules choose the biggest
  // concat arrays with preffered and allowed and remaing items that are passed the rules.
  if (filteredAndNotPreferred.length > 1) {
    const max = filteredAndNotPreferred.reduce((a, b) => Math.max(a, b));
    result = [...filteredAndPreferred, max];
  } else {
    result = [...filteredAndPreferred, filteredAndNotPreferred[0]];
  }

  // thank you for watching :)
  return result;
};

console.log(attempt(...example1));
console.log(attempt(...example2));
console.log(attempt(...example3));
console.log(attempt(...example4));
console.log(attempt(...example5));
console.log(attempt(...example6));
console.log(attempt(...example7));
console.log(attempt(...example8));
console.log(attempt(...example9));
console.log(attempt(...example10));
console.log(attempt(...example11));
console.log(attempt(...example12));