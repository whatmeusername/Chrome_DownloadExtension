import { declOfNum } from '../../utils/declOfNum';
import './LoadingElement.scss';

function LoadingElement({ count }: { count?: number }) {
	return (
		<div className="loading__element__wrapper">
			<span className="loading__element" />
			<p className="loading__element__label">
				{count ? `Collecting data from ${count} ${declOfNum(count, ['image', 'images', 'images'])}` : 'Searching images'}
			</p>
		</div>
	);
}

export { LoadingElement };
