import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const GoogleSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={20} height={12} fill='none'>
    <Path
      fill='#040325'
      d='M6.516 4.903h5.616A6.767 6.767 0 0 1 12 8.062a5.395 5.395 0 0 1-1.536 2.5c-.672.615-1.491 1.039-2.456 1.273a6.407 6.407 0 0 1-3.071-.044 5.567 5.567 0 0 1-2.15-1.097A5.823 5.823 0 0 1 1.164 8.72C.52 7.49.344 6.19.637 4.815a4.544 4.544 0 0 1 .527-1.491C1.866 1.86 2.992.867 4.542.34c1.345-.468 2.69-.453 4.036.044a6.04 6.04 0 0 1 1.93 1.185c-.058.088-.16.205-.307.35-.146.118-.234.205-.263.264a6.43 6.43 0 0 0-.57.526 7.45 7.45 0 0 0-.527.57 3.06 3.06 0 0 0-1.316-.789 3.254 3.254 0 0 0-1.755-.044 3.497 3.497 0 0 0-1.799.965c-.38.41-.672.892-.877 1.448a3.522 3.522 0 0 0 0 2.325 3.65 3.65 0 0 0 1.404 1.843c.41.293.848.483 1.316.57.439.088.921.088 1.448 0a3.283 3.283 0 0 0 1.316-.526c.673-.439 1.068-1.053 1.184-1.843H6.516V4.903Zm12.723.132v1.491h-2.062v2.018h-1.492V6.526h-2.062V5.035h2.062V2.973h1.492v2.062h2.062Z'
    />
  </Svg>
);

export default GoogleSvg;
