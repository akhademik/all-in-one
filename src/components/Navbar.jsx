import React from 'react';
import '../styles/navbar.scss';
import logo from '../asset/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<div className='nav'>
			<Link to='/'>
				<img
					className='logo'
					src={logo}
					alt=''
				/>
			</Link>
			<ul className='nav-menu'>
				<li>
					<Link to='/dulich'>BH Du lịch</Link>
				</li>
				<li>
					<Link to='/oto'>BH ô tô</Link>
				</li>
				<li>
					<Link to='/'>Liên Hệ</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navbar;
