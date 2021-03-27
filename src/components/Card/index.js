import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from "../Board/context";

import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {
    const ref = useRef();
    const { move } = useContext(BoardContext);

    // dragRef: referencia ao elemrnto q pode ser arrastado
    const [{ isDragging }, dragRef] = useDrag({
        item: {type: 'CARD', index, listIndex},
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: 'CARD',
        hover(item, monitor){

            const draggedListIndex = item.listIndex;
            const targetListIndex = listIndex;

            const draggedIndex = item.index;
            const targetIndex = index;

            if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
                return;
            }
            console.log(item.index, index);

            //pega as configs do dom do objeto na tela
            const targetSize = ref.current.getBoundingClientRect();
            
            //pega o valor que corresponde ao centro do objeto 
            const targetCenter = (targetSize.bottom - targetSize.top) / 2;
            
            //pega o offset do elemnto em relação ao objeto q esta sobreposto a ele
            const draggedOffset = monitor.getClientOffset();
            
            //realiza o calcula para ver se deve posicionar o objeto apos o elemnto ou nao
            const draggedTop = draggedOffset.y - targetSize.top;
      
            if (draggedIndex < targetIndex && draggedTop < targetCenter) {
              return;
            }
      
            if (draggedIndex > targetIndex && draggedTop > targetCenter) {
              return;
            }
      
            move(draggedListIndex,targetListIndex, draggedIndex, targetIndex);
            
            item.index = targetIndex;
            item.listIndex = targetListIndex;
        }   
    })

    dragRef(dropRef(ref));
    
  return (
    <Container ref={ref} isDragging={isDragging}>
        <header>{data.labels.map(label => <Label key={label} color={label} />)}</header>
        <p>{data ? data.content : ''}</p>
        {data.user &&<img src={data.user} alt="" />}
    </Container>
  );
}