import CSS from 'csstype';

const colors = {
  employee: '#FFD700',
  environmental: '#FF8C00',
  property: '#ff40ff',
  fire: '#ff4088',
  vehicle: '#ff40aa',
  closed: '#008000',
  open: '#000080',
  ack: '#800080',
  closedBg: '#e2ffe2',
  openBg: '#e2e2ff',
  ackBg: '#f9b8f6',
};

export const typeStyles = (
  type: 'employee' | 'environmental' | 'property' | 'vehicle' | 'fire'
): CSS.Properties => {
  return {
    color: type === 'employee' ? '#000' : '#fff',
    backgroundColor: colors[type],
    borderRadius: '4px',
    fontWeight: 500,
    padding: '0.35em',
    maxWidth: 'max-content',
  };
};

export const statusStyles = (isAcknowledged: boolean, isResolved: boolean): CSS.Properties => {
  const color = isAcknowledged && !isResolved ? colors.ack : isResolved ? colors.closed : colors.open;
  const backgroundColor = isAcknowledged && !isResolved ? colors.ackBg : isResolved ? colors.closedBg : colors.openBg;

  return {
    color,
    backgroundColor,
    borderRadius: '4px',
    fontWeight: 500,
    padding: '0.35em',
    maxWidth: 'max-content',
  };
};
