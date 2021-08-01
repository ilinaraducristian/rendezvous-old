type ComponentProps = {
  name: string
}

function MemberComponent({name}: ComponentProps) {
  return (
      <li>
        {name}
      </li>
  );
}

export default MemberComponent;
