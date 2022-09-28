import React, { useReducer } from 'react';
import { formatInputNumber, calculatePrice, calculateYearRange } from '../helpers';

const initStates = {
	Cost: 300000000,
	Year: { currentYear: new Date().getFullYear(), pickYear: new Date().getFullYear() },
	Checked: { cb: true, o3: false, o6: false, o7: false, o8: false },
	Price: 0,
	DKBS: {
		o3: { title: `Mất cắp bộ phận`, isAvail: true },
		o6: { title: `Không khấu hao phụ tùng, vật tư thay mới`, isAvail: true },
		o7: { title: `Lựa chọn cơ sở sửa chữa`, isAvail: true },
		o8: { title: `Thiệt hại động cơ xe do bị thủy kích`, isAvail: true },
	},
};

const reducer = (states, action) => {
	const actionSets = {
		setCost: { ...states, Cost: action.payload },
		setYear: { ...states, Year: action.payload },
		setChecked: { ...states, Checked: action.payload },
		setPrice: { ...states, Price: action.payload },
		setDKBS: { ...states, DKBS: action.payload },
	};
	return actionSets[action.type];
};

const BHoto = () => {
	const [states, dispatch] = useReducer(reducer, initStates);
	const { Cost, Year, Checked, Price, DKBS } = states;

	const handleFormSubmit = e => {
		e.preventDefault();
		dispatch({ type: 'setPrice', payload: calculatePrice(Cost, Year, Checked, DKBS) });
	};

	const handleCheck = ({ target }) => {
		const val = target.getAttribute('data-type');
		dispatch({ type: 'setChecked', payload: { ...Checked, [val]: target.checked } });
	};

	const handleInput = ({ target }) => {
		const val = target.getAttribute('data-type');
		if (val === 'cost') {
			formatInputNumber(target);
			dispatch({ type: 'setCost', payload: target.value });
		} else {
			const newYear = { ...Year, pickYear: target.value };
			dispatch({ type: 'setYear', payload: newYear });

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
			dispatch({ type: 'setDKBS', payload: newDKBS });
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
