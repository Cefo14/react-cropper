import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
  },

  img: {
    maxWidth: '100%',
    display: 'block',
  },

  actionContainer: {
    paddingTop: theme.spacing(2),
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',

    '& > button:first-child': {
      paddingRight: theme.spacing(1),
    },
  },
}));
