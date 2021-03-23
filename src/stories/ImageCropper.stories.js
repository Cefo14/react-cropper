import React, { useCallback } from 'react';

import { action } from '@storybook/addon-actions';
import {
  text,
  number,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs';

import ImageCropper from '../components/ImageCropper';

export const Main = () => {
  const url = text('url', 'https://dummyimage.com/1920x1080/000/ffffff');
  const viewMode = number('viewMode', 0);
  const zoomable = boolean('zoomable', true, 'Other');
  const scalable = boolean('scalable', true, 'Other');
  const rotatable = boolean('rotatable', true, 'Other');
  const disabled = boolean('disabled', false, 'Other');

  const onCrop = useCallback((event, blob) => {
    const _url = URL.createObjectURL(blob);
    action('onCrop')(event, blob);
    window.open(_url, '_blank', 'noopener');
  }, []);

  return (
    <ImageCropper
      url={url}
      viewMode={viewMode}
      zoomable={zoomable}
      scalable={scalable}
      rotatable={rotatable}
      disabled={disabled}
      onCrop={onCrop}
    />
  );
};

export default {
  title: 'ImageCropper',
  decorators: [withKnobs],
};
