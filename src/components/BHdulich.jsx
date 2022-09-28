import React, { useState, useReducer } from 'react';
import '../styles/bhdulich.scss';
import { formatInputNumber, getResult, fixCommaNumber } from '../helpers';

const initStates = {
	sum: 10000000,
	days: 7,
	discount: 0,
	result: 0,
};

const reducer = (states, action) => {
	const actionSets = {
		setSum: { ...states, sum: action.payload },
		setDays: { ...states, days: action.payload },
		setDiscount: { ...states, discount: action.payload },
		setResult: { ...states, result: action.payload },
	};
	return actionSets[action.type];
};

const DO = {
	setSum: 'setSum',
	setDays: 'setDays',
	setDiscount: 'setDiscount',
	setResult: 'setResult',
};

const BHdulich = () => {
	const [states, dispatch] = useReducer(reducer, initStates);
	const { sum, days, discount, result } = states;

	const handleInput = ({ target }) => {
		const CLASS = target.classList;
		formatInputNumber(target);

		if (CLASS.contains('sum')) {
			dispatch({ type: DO.setSum, payload: target.value });
		} else if (CLASS.contains('days')) {
			dispatch({ type: DO.setDays, payload: target.value });
		} else if (CLASS.contains('discount')) {
			dispatch({ type: DO.setDiscount, payload: target.value });
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		return dispatch({
			type: DO.setResult,
			payload: getResult(fixCommaNumber(days), fixCommaNumber(sum), fixCommaNumber(discount)),
		});
	};

	return (
		<div className='wrapper'>
			<div className='top_head'>BH NƯỚC NGOÀI DU LỊCH</div>
			<div className='result_cont'>
				<p className={`price ${!result ? '' : 'result'} `}>{!result ? `PVI GIA ĐỊNH` : result}</p>
			</div>
			<div>
				<form onSubmit={handleSubmit}>
					<label>MỨC TRÁCH NHIỆM</label>
					<input
						className='sum'
						type='text'
						onChange={handleInput}
						value={sum === 10000000 ? `10,000,000` : sum}
					/>

					<label>SỐ NGÀY BẢO HIỂM</label>
					<input
						className='days'
						type='text'
						onChange={handleInput}
						value={days === 7 ? 7 : days}
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
						value={discount === 0 ? `0 %` : discount}
					/>
					<button>Tính Giá</button>
				</form>
			</div>
		</div>
	);
};

export default BHdulich;
