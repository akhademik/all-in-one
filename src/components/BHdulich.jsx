import React, { useState } from 'react';
import '../styles/bhdulich.scss';
import { formatInputNumber, getResult, fixCommaNumber } from '../helpers';

const BHdulich = () => {
	const [Sum, setSum] = useState(10000000);
	const [Days, setDays] = useState(7);
	const [Discount, setDiscount] = useState(0);
	const [Result, setResult] = useState(0);

	const handleInput = ({ target }) => {
		const CLASS = target.classList;
		formatInputNumber(target);

		if (CLASS.contains('sum')) {
			setSum(target.value);
		} else if (CLASS.contains('days')) {
			setDays(target.value);
		} else if (CLASS.contains('discount')) {
			setDiscount(target.value);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		return setResult(
			getResult(fixCommaNumber(Days), fixCommaNumber(Sum), fixCommaNumber(Discount))
		);
	};

	return (
		<div className='wrapper'>
			<div className='top_head'>BH NƯỚC NGOÀI DU LỊCH</div>
			<div className='result_cont'>
				<p className={`price ${!Result ? '' : 'result'} `}>
					{!Result ? `PVI GIA ĐỊNH` : Result}
				</p>
			</div>
			<div>
				<form onSubmit={handleSubmit}>
					<label>MỨC TRÁCH NHIỆM</label>
					<input
						className='sum'
						type='text'
						onChange={handleInput}
						value={Sum === 10000000 ? `10,000,000` : Sum}
					/>

					<label>SỐ NGÀY BẢO HIỂM</label>
					<input
						className='days'
						type='text'
						onChange={handleInput}
						value={Days === 7 ? 7 : Days}
					/>

					<label>MỨC GIẢM</label>
					<input
						className='discount'
						type='text'
						onChange={handleInput}
						onBlur={({ target }) => (target.value = `${target.value} %`)}
						onFocus={({ target }) =>
							(target.value = target.value.replace(' ', '').replace('%', ''))
						}
						value={Discount === 0 ? `0 %` : Discount}
					/>
					<button>Tính Giá</button>
				</form>
			</div>
		</div>
	);
};

export default BHdulich;
