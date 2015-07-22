import Nexus from './Nexus';

export default ({ nexus }, Component) => class extends Component {
  render() {
    Nexus.currentNexus = nexus;
    return super.render();
  }
};
