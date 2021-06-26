type ComponentProps = {
  name: string
}

function MemberComponent({name}: ComponentProps) {
  return (
      <div id="member-container">
        {name}
      </div>
  );
}

export default MemberComponent;
