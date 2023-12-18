import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils.js';

const hooks = [];

const orgLog = console.log;
console.log = (...args) => {
  orgLog(...args);
  hooks.forEach((hook) => hook(...args));
  console.warn('Log:', ...args);
};

function Log(props) {
  const { className } = props;
  const [logList, setLogList] = useState([]);
  useEffect(() => {
    hooks.push((...args) => {
      setLogList((list) => [...list, args.join(' ')]);
    });
    return () => {
      hooks.pop();
    };
  }, []);

  return (
    <div className={cn('overflow-y-auto', className)}>
      Log
      <pre>{logList}</pre>
    </div>
  );
}

Log.propTypes = {
  className: PropTypes.string,
};

Log.defaultProps = {
  className: '',
};

export default Log;
