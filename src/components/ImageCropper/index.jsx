/* eslint-disable react/no-this-in-sfc */
import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import CropIcon from '@material-ui/icons/Crop';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import useStyles from './useStyles';

const FLIP_STEAP = -1;
const ROTATION_STEAP = 90;
const ZOOM_STEAP = 0.01;

const ImageCropper = ({
  url,
  viewMode,
  zoomable,
  scalable,
  rotatable,
  disabled,
  onCrop,
}) => {
  const classes = useStyles();

  const imageRef = useRef(null);
  const [cropper, setCropper] = useState(null);
  const [horizontalScale, setHorizontalScale] = useState(1);
  const [verticalScale, setVerticalScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const destroyCropper = useCallback(() => {
    if (cropper) cropper.destroy();
    setIsReady(false);
  }, [cropper]);

  const startCroppper = useCallback(
    () => {
      const _cropper = new Cropper(
        imageRef.current,
        {
          checkCrossOrigin: true,
          responsive: true,
          viewMode,
          zoomable,
          scalable,
          rotatable,
          ready() {
            setIsReady(true);
          },
        },
      );
      setCropper(_cropper);
    },
    [
      imageRef,
      viewMode,
      zoomable,
      scalable,
      rotatable,
    ],
  );

  const resetCropper = useCallback(() => {
    if (!cropper) return;
    destroyCropper();
    startCroppper();
  }, [cropper, startCroppper, destroyCropper]);

  const flipHorizontal = useCallback(() => {
    const newScale = horizontalScale * FLIP_STEAP;
    setHorizontalScale(newScale);
  }, [horizontalScale]);

  const flipVertical = useCallback(() => {
    const newScale = verticalScale * FLIP_STEAP;
    setVerticalScale(newScale);
  }, [verticalScale]);

  const flipImage = useCallback(() => {
    if (!cropper) return;
    cropper.scale(horizontalScale, verticalScale);
    cropper.crop();
  }, [cropper, horizontalScale, verticalScale]);

  const rotateLeft = useCallback(() => {
    const newRotation = rotation - ROTATION_STEAP;
    setRotation(newRotation);
  }, [rotation]);

  const rotateRigth = useCallback(() => {
    const newRotation = rotation + ROTATION_STEAP;
    setRotation(newRotation);
  }, [rotation]);

  const rotateImage = useCallback(() => {
    if (!cropper) return;
    cropper.rotateTo(rotation);
    cropper.crop();
  }, [cropper, rotation]);

  const zoomIn = useCallback(() => {
    const newZoom = zoom <= 0 ? ZOOM_STEAP : Math.abs(zoom) + ZOOM_STEAP;
    setZoom(newZoom);
  }, [zoom]);

  const zoomOut = useCallback(() => {
    const newZoom = zoom >= 0 ? -ZOOM_STEAP : zoom - ZOOM_STEAP;
    setZoom(newZoom);
  }, [zoom]);

  const zoomImage = useCallback(() => {
    if (!cropper) return;
    cropper.zoom(zoom);
    cropper.crop();
  }, [cropper, zoom]);

  const cropImage = useCallback(async (event) => {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve);
    });
    onCrop(event, blob);
  }, [cropper, onCrop]);

  useEffect(() => {
    flipImage();
  }, [horizontalScale, verticalScale, flipImage]);

  useEffect(() => {
    rotateImage();
  }, [rotation, rotateImage]);

  useEffect(() => {
    if (isReady) zoomImage();
  }, [isReady, zoom, zoomImage]);

  useEffect(() => {
    startCroppper();
  }, []);

  useEffect(
    () => {
      resetCropper();
    },
    [
      url,
      viewMode,
      zoomable,
      scalable,
      rotatable,
    ],
  );

  useEffect(() => {
    if (cropper && disabled) cropper.disable();
    if (cropper && !disabled) cropper.enable();
  }, [disabled]);

  return (
    <div className={classes.container}>
      <div>
        <img
          ref={imageRef}
          alt={url}
          src={url}
          className={classes.img}
        />
      </div>
      <Grid
        container
        spacing={2}
        justify="space-between"
        className={classes.actionContainer}
      >
        <Grid item sm={3}>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={flipHorizontal}
              disabled={disabled}
            >
              <CropLandscapeIcon />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={flipVertical}
              disabled={disabled}
            >
              <CropPortraitIcon />
            </Button>
          </div>
        </Grid>
        <Grid item sm={3}>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={rotateLeft}
              disabled={disabled}
            >
              <RotateLeftIcon />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={rotateRigth}
              disabled={disabled}
            >
              <RotateRightIcon />
            </Button>
          </div>
        </Grid>
        <Grid item sm={3}>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={zoomIn}
              disabled={disabled}
            >
              <ZoomInIcon />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={zoomOut}
              disabled={disabled}
            >
              <ZoomOutIcon />
            </Button>
          </div>
        </Grid>
        <Grid item sm={3}>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={cropImage}
              disabled={disabled}
            >
              <CropIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

ImageCropper.propTypes = {
  url: PropTypes.string,
  viewMode: PropTypes.oneOf([0, 1, 2, 3]),
  zoomable: PropTypes.bool,
  scalable: PropTypes.bool,
  rotatable: PropTypes.bool,
  disabled: PropTypes.bool,
  onCrop: PropTypes.func,
};

ImageCropper.defaultProps = {
  url: '',
  viewMode: 0,
  zoomable: true,
  scalable: true,
  rotatable: true,
  disabled: false,
  onCrop: () => {},
};

export default memo(ImageCropper);
