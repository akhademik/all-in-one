const PRICERANGE = {
	upto3y: { cb: 1.5, o3: 0.2, o6: 0, o7: 0.1, o8: 0.1 },
	above3till6: { cb: 1.65, o3: 0.1, o6: 0.1, o7: 0.2, o8: 0.1 },
	above6till10: { cb: 1.8, o6: 0.15, o7: 0.3, o8: 0.1 },
	above10till15: { cb: 1.95, o6: 0.2 },
	above15till20: { cb: 2.1 },
	above20: { cb: 2.25 },
};
function getDiscount(priceRange) {
	const data = {
		below500tr: 1,
		between57: 1 - 0.15,
		above7: 1 - 0.25,
	};

	return data[priceRange];
}

function calculatePriceRange(price) {
	const newPrice = fixCommaNumber(price);
	const p500tr = 500000000;
	const p700tr = 700000000;
	let priceRange = '';

	if (newPrice < p500tr) {
		priceRange = 'below500tr';
	} else if (newPrice == p500tr && newPrice < p700tr) {
		priceRange = 'between57';
	} else if (newPrice === p700tr || newPrice > p700tr) {
		priceRange = 'above7';
	}
	return priceRange;
}

export function calculateYearRange(year) {
	const newYear = parseInt(year.pickYear) - 1;
	const currentYear = new Date().getFullYear();

	// year ranges
	let yearRange = '';
	const year3 = currentYear - 3;
	const year6 = currentYear - 6;
	const year10 = currentYear - 10;
	const year15 = currentYear - 15;
	const year20 = currentYear - 20;

	if (newYear > year3 || newYear === year3) {
		yearRange = 'upto3y';
	} else if ((newYear < year3 && year6 < newYear) || newYear == year6) {
		yearRange = 'above3till6';
	} else if ((newYear < year6 && year10 < newYear) || newYear == year10) {
		yearRange = 'above6till10';
	} else if ((newYear < year10 && year15 < newYear) || newYear == year15) {
		yearRange = 'above10till15';
	} else if ((newYear < year15 && year20 < newYear) || newYear == year20) {
		yearRange = 'above15till20';
	} else if (newYear < year20) {
		yearRange = 'above20';
	}

	return yearRange;
}

function tinhphiBH(cost, year, priceRange, checkedInput, DKBS) {
	const iso3 = checkedInput.o3;
	const iso6 = checkedInput.o6;
	const iso7 = checkedInput.o7;
	const iso8 = checkedInput.o8;

	const o3Avail = DKBS.o3.isAvail;
	const o6Avail = DKBS.o6.isAvail;
	const o7Avail = DKBS.o7.isAvail;
	const o8Avail = DKBS.o8.isAvail;

	let { cb, o3, o6, o7, o8 } = PRICERANGE[`${year}`];
	let PRICE = 0;
	const discount = getDiscount(priceRange);

	PRICE =
		cost *
		(((cb +
			(!iso3 ? 0 : o3Avail ? o3 : 0) +
			(!iso6 ? 0 : o6Avail ? o6 : 0) +
			(!iso7 ? 0 : o7Avail ? o7 : 0) +
			(!iso8 ? 0 : o8Avail ? o8 : 0)) *
			discount) /
			100);

	return PRICE;
}

export function calculatePrice(cost, year, checkedInput, DKBS) {
	return tinhphiBH(
		fixCommaNumber(cost),
		calculateYearRange(year),
		calculatePriceRange(cost),
		checkedInput,
		DKBS
	);
}

export function fixCommaNumber(element) {
	return element.length > 3 ? parseInt(element.replaceAll(',', '')) : parseInt(element);
}

export function formatInputNumber(element) {
	element.value = element.value
		.replace(/^0/, '') //not allowed 0 as first input value
		.replace(/\D/g, '') //only numbers are allowed
		.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //add ',' each 3 numbers
}

export function getResult(days, sum, discount) {
	/* BIEU PHI
Tu 1 den 10: 0.015%
Tu 11 den 20: 0.012%
Tu 21 den 60: 0.010%
Tu 61 den 90: 0.008%
Tren 90: 0.005%
*/
	//

	const days10 = days - 10;
	const days20 = days - 20;
	const days60 = days - 60;
	const days90 = days - 90;
	const rateDis = 1 - discount / 100;
	const rateD10 = 0.015 * 10;
	const rateD20 = 0.012 * 10;
	const rateD60 = 0.01 * 40;
	const rateD90 = 0.008 * 30;

	const d10 = ((0.015 * days * sum) / 100) * rateDis;
	const d20 = ((rateD10 * sum) / 100) * rateDis + ((0.012 * days10 * sum) / 100) * rateDis;
	const d60 =
		((rateD10 * sum) / 100) * rateDis +
		((rateD20 * sum) / 100) * rateDis +
		((0.01 * days20 * sum) / 100) * rateDis;
	const d90 =
		((rateD10 * sum) / 100) * rateDis +
		((rateD20 * sum) / 100) * rateDis +
		((rateD60 * sum) / 100) * rateDis +
		((0.008 * days60 * sum) / 100) * rateDis;
	const lastRate =
		((rateD10 * sum) / 100) * rateDis +
		((rateD20 * sum) / 100) * rateDis +
		((rateD60 * sum) / 100) * rateDis +
		((rateD90 * sum) / 100) * rateDis +
		((0.005 * days90 * sum) / 100) * rateDis;

	if (days > 90) {
		return Math.ceil(lastRate).toLocaleString('en-US');
	} else if (60 <= days && days <= 90) {
		return Math.ceil(d90).toLocaleString('en-US');
	} else if (21 <= days && days <= 60) {
		return Math.ceil(d60).toLocaleString('en-US');
	} else if (11 <= days && days <= 20) {
		return Math.ceil(d20).toLocaleString('en-US');
	} else if (1 <= days && days <= 10) {
		return Math.ceil(d10).toLocaleString('en-US');
	}
}
