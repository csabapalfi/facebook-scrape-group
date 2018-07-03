const target = document.querySelector('[aria-label="News Feed"]');
const observer = new MutationObserver(
    (records) => records.forEach(
        (({addedNodes}) => addedNodes.forEach(
            node => console.log('permalink/' + node.id.replace(/:.*/, '').replace('mall_post_', ''))
        ))
    )
);
observer.observe(target, {childList: true});