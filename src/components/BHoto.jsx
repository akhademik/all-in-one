import React, { useState } from 'react';
import { formatInputNumber, calculatePrice, calculateYearRange } from '../helpers';

const BHoto = () => {
	const [Cost, setCost] = useState(300000000);
	const [Year, setYear] = useState({
		currentYear: new Date().getFullYear(),
		pickYear: new Date().getFullYear(),
	});

	const [Checked, setChecked] = useState({
		cb: true,
		o3: false,
		o6: false,
		o7: false,
		o8: false,
	});
	const [Price, setPrice] = useState(0);

	const [DKBS, setDKBS] = useState({
		o3: { title: `Mất cắp bộ phận`, isAvail: true },
		o6: { title: `Không khấu hao phụ tùng, vật tư thay mới`, isAvail: true },
		o7: { title: `Lựa chọn cơ sở sửa chữa`, isAvail: true },
		o8: { title: `Thiệt hại động cơ xe do bị thủy kích`, isAvail: true },
	});

	const handleFormSubmit = e => {
		e.preventDefault();
		setPrice(calculatePrice(Cost, Year, Checked, DKBS));
	};

	const handleCheck = ({ target }) => {
		const val = target.getAttribute('data-type');
		const newCheckedState = { ...Checked, [val]: target.checked };
		setChecked(newCheckedState);
	};

	const handleInput = ({ target }) => {
		const val = target.getAttribute('data-type');
		if (val === 'cost') {
			formatInputNumber(target);
			setCost(target.value);
		} else {
			const newYear = { ...Year, pickYear: target.value };
			setYear(newYear);
			const isCheckAvail = calculateYearRange(newYear);
			const { ...newDKBS } = DKBS;

			switch (isCheckAvail) {
				case 'upto3y':
					newDKBS.o3.isAvail = newDKBS.o6.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = true;
					break;
				case 'above3till6':
					newDKBS.o3.isAvail = newDKBS.o6.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = true;
					break;
				case 'above6till10':
					newDKBS.o6.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = true;
					newDKBS.o3.isAvail = false;
					break;
				case 'above10till15':
					newDKBS.o6.isAvail = true;
					newDKBS.o3.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = false;
					break;
				case 'above15till20':
					newDKBS.o3.isAvail = newDKBS.o6.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = false;
					break;
				case 'above20':
					newDKBS.o3.isAvail = newDKBS.o6.isAvail = newDKBS.o7.isAvail = newDKBS.o8.isAvail = false;
					break;
			}
			setDKBS(newDKBS);
		}
	};

	const printYear = () => {
		const results = [];
		for (let i = Year.currentYear - 20; i < Year.currentYear; i++) {
			results.push(
				<option
					key={i + 1}
					value={i + 1}>
					{i + 1}
				</option>
			);
		}
		return results;
	};
	return (
		<div className='wrapper'>
			<div className='top_head'>BH VẬT CHẤT XE ÔTÔ</div>
			<div className='result_cont'>
				<p className={`price ${Price == 0 ? '' : 'result car'} `}>
					{Price == 0 ? `PVI GIA ĐỊNH` : Price.toLocaleString('en-US')}
				</p>
			</div>
			<div>
				<form onSubmit={handleFormSubmit}>
					<label>Giá trị xe:</label>
					<input
						data-type='cost'
						type='text'
						value={Cost === 300000000 ? '300,000,000' : Cost}
						onChange={handleInput}
					/>
					<label>Năm SX:</label>
					<select
						name='year'
						className='year'
						value={Year.pickYear}
						onChange={handleInput}>
						{printYear()}
					</select>
					<p>Các gói đăng ký bổ sung:</p>
					{Object.keys(DKBS).map(key => (
						<div
							className='packages'
							key={key}>
							<input
								type='checkbox'
								data-type={key}
								onChange={handleCheck}
								disabled={!DKBS[key].isAvail}
							/>
							<p>{DKBS[key].title}</p>
						</div>
					))}
					<button>Kiểm Tra Giá</button>
				</form>
			</div>
		</div>
	);
};

export default BHoto;
