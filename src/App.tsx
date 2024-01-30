import { useEffect, useRef, useState } from 'react';
import { DownloaderExtension } from './Componets/DownloaderExtension/DownloaderExtension';
import { StaticLinksResult } from './interface';
import { CollectAllStaticLinks } from './utils/CollectAllStaticLinks';
import { ChromeCollectData } from './utils/ChromeCollectData';

const IS_PROD = import.meta.env.PROD;

function App() {
	const testRef = useRef<HTMLIFrameElement>(null!);
	const [isLoaded, setLoaded] = useState(0);
	const [staticLinks, setStaticLinks] = useState<StaticLinksResult>(null!);

	useEffect(() => {
		if (IS_PROD) {
			ChromeCollectData(setLoaded, setStaticLinks);
		} else {
			setStaticLinks(CollectAllStaticLinks(testRef.current.contentDocument as Document));
		}
	}, [isLoaded]);

	return (
		<div className="app">
			{!IS_PROD ? <iframe src="HTML_TEST_PAGE/index.html" className="test__iframe" ref={testRef} onLoad={() => setLoaded(1)} /> : null}
			{isLoaded && staticLinks !== null ? <DownloaderExtension staticLinks={staticLinks} /> : null}
		</div>
	);
}

export default App;
