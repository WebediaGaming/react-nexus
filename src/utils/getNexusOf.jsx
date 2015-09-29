import $nexus from '../$nexus';

export default function getNexusOf(component) {
  return component.context[$nexus];
}
