export function findCultures(objectData) {
  const culturesAndCounts = {};
  objectData.forEach((object) => {
    const culture = object.culture;
    if (culture) {
      culturesAndCounts[culture] = (culturesAndCounts[culture] || 0) + 1;
    }
  });
  return culturesAndCounts;
}

export function findMediums(objectData) {
  const mediumsAndCounts = {};
  objectData.forEach((object) => {
    const medium = object.medium;
    if (medium) {
      mediumsAndCounts[medium] = (mediumsAndCounts[medium] || 0) + 1;
    }
  });
  return mediumsAndCounts;
}

export function findPeriods(objectData) {
  const periodsAndCounts = {};
  objectData.forEach((object) => {
    const period = object.period;
    if (period) {
      periodsAndCounts[period] = (periodsAndCounts[period] || 0) + 1;
    }
  });
  return periodsAndCounts;
}

export function findClassifications(objectData) {
  const classificationsAndCounts = {};
  objectData.forEach((object) => {
    const classification = object.classification;
    if (classification) {
      classificationsAndCounts[classification] = (classificationsAndCounts[classification] || 0) + 1;
    }
  });
  return classificationsAndCounts;
}
